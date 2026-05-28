export class GranolaCliError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "GranolaCliError";
  }
}

export function handleCliError(
  error: unknown,
  options: Pick<GlobalOptions, "json" | "pretty">,
): never {
  const normalized = mapError(error);

  if (options.json) {
    const spacing = options.pretty ? 2 : 0;
    process.stderr.write(
      `${JSON.stringify(
        {
          error: {
            code: normalized.code,
            message: normalized.message,
            details: normalized.details,
          },
        },
        null,
        spacing,
      )}\n`,
    );
  } else {
    process.stderr.write(`${normalized.code}: ${normalized.message}\n`);
  }

  process.exit(1);
}

function mapError(error: unknown): GranolaCliError {
  if (error instanceof GranolaCliError) {
    return error;
  }

  return new GranolaCliError(
    "INTERNAL_ERROR",
    error instanceof Error ? error.message : String(error),
  );
}

type GlobalOptions = Awaited<ReturnType<typeof getGlobalOptions>>;

// Forward reference — set during main() before commands run.
// This avoids circular imports between errors.ts and main.ts.
let _getGlobalOptions: () => {
  json: boolean;
  pretty: boolean;
};

export function setGlobalOptionsGetter(
  getter: () => { json: boolean; pretty: boolean },
): void {
  _getGlobalOptions = getter;
}

function getGlobalOptions() {
  return _getGlobalOptions();
}
