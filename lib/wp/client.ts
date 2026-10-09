/**
 * Minimal WPGraphQL transport.
 *
 * Deliberately not Apollo/urql: every read in this app happens in a Server
 * Component or route handler, so there is no client-side normalised cache to
 * justify. Caching is layered on top in `lib/wp/api.ts` via `"use cache"`.
 */

export class WpGraphQLError extends Error {
  readonly query: string;
  readonly variables: Record<string, unknown>;
  readonly graphQLErrors: readonly { message: string }[];

  constructor(
    message: string,
    options: {
      query: string;
      variables: Record<string, unknown>;
      graphQLErrors?: readonly { message: string }[];
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "WpGraphQLError";
    this.query = options.query;
    this.variables = options.variables;
    this.graphQLErrors = options.graphQLErrors ?? [];
  }
}

function endpoint(): string {
  const url = process.env.WP_GRAPHQL_URL;
  if (!url) {
    throw new Error(
      "WP_GRAPHQL_URL is not set. Copy .env.example to .env.local and point it at your WordPress /graphql endpoint.",
    );
  }
  return url;
}

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: { message: string }[];
}

/**
 * Execute a GraphQL operation against WordPress.
 *
 * Always uncached at this level — callers decide the caching policy. Under
 * `cacheComponents` an uncached fetch inside a `"use cache"` function is
 * memoised by that cache entry, which is exactly what we want.
 */
export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (cause) {
    throw new WpGraphQLError(
      `Could not reach WordPress at ${endpoint()}. Is the local site running?`,
      { query, variables, cause },
    );
  }

  if (!response.ok) {
    throw new WpGraphQLError(
      `WordPress returned HTTP ${response.status} ${response.statusText}.`,
      { query, variables },
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new WpGraphQLError(
      `WPGraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
      { query, variables, graphQLErrors: json.errors },
    );
  }

  if (json.data == null) {
    throw new WpGraphQLError("WPGraphQL returned no data.", { query, variables });
  }

  return json.data;
}
