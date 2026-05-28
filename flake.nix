{
  description = "granola-cli - CLI for Granola meeting notes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, git-hooks }:
    let
      version = "0.1.0";

      # Binary hashes for releases - update these after each release
      # Run: nix hash file --sri <binary>
      binaries = {
        "aarch64-darwin" = {
          url = "https://github.com/aliou/granola-cli/releases/download/v${version}/granola-darwin-arm64";
          hash = "sha256-aR2fEw3qg3NieRoLSuVdX2Ps3UFUbyg0itqrFegBSDo="; # darwin
        };
        "aarch64-linux" = {
          url = "https://github.com/aliou/granola-cli/releases/download/v${version}/granola-linux-arm64";
          hash = "sha256-a3lrPweGdysFhj8MOij3XWdfuf4CurCJjqd18DkJo2w="; # linux-arm64
        };
      };

      # Build from source for development
      buildFromSource = pkgs: pkgs.stdenv.mkDerivation {
        pname = "granola-cli";
        inherit version;

        src = ./.;

        nativeBuildInputs = [ pkgs.nodejs_26 pkgs.pnpm pkgs.makeWrapper ];

        buildPhase = ''
          export HOME=$(mktemp -d)
          pnpm install --frozen-lockfile
          pnpm build:esm
        '';

        installPhase = ''
          mkdir -p $out/lib/granola-cli
          cp -r dist $out/lib/granola-cli/
          cp package.json $out/lib/granola-cli/

          mkdir -p $out/bin
          cat > $out/bin/granola << 'EOF'
          #!/usr/bin/env bash
          exec ${pkgs.nodejs_26}/bin/node "$out/lib/granola-cli/dist/main.mjs" "$@"
          EOF
          chmod +x $out/bin/granola

          substituteInPlace $out/bin/granola --replace '$out' "$out"
        '';

        meta = with pkgs.lib; {
          description = "CLI for Granola meeting notes";
          homepage = "https://github.com/aliou/granola-cli";
          license = licenses.mit;
          platforms = platforms.all;
          mainProgram = "granola";
        };
      };

      # Fetch prebuilt binary from release
      fetchBinary = pkgs: system:
        let
          binary = binaries.${system} or (throw "Unsupported system: ${system}");
        in
        pkgs.stdenv.mkDerivation {
          pname = "granola-cli";
          inherit version;

          src = pkgs.fetchurl {
            url = binary.url;
            hash = binary.hash;
          };

          dontUnpack = true;

          installPhase = ''
            mkdir -p $out/bin
            cp $src $out/bin/granola
            chmod +x $out/bin/granola
          '';

          meta = with pkgs.lib; {
            description = "CLI for Granola meeting notes";
            homepage = "https://github.com/aliou/granola-cli";
            license = licenses.mit;
            platforms = [ "aarch64-darwin" "aarch64-linux" ];
            mainProgram = "granola";
          };
        };
    in
    flake-utils.lib.eachSystem [ "aarch64-darwin" "aarch64-linux" ] (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        granola-cli = buildFromSource pkgs;

        pre-commit-check = git-hooks.lib.${system}.run {
          src = ./.;
          hooks = {
            biome-format = {
              enable = true;
              name = "biome format";
              entry = "${pkgs.nodejs_26}/bin/npx biome check --write";
              files = "\\.(ts|json)$";
              pass_filenames = false;
            };
            typecheck = {
              enable = true;
              name = "typecheck";
              entry = "${pkgs.nodejs_26}/bin/npx tsc --noEmit";
              files = "\\.ts$";
              pass_filenames = false;
            };
          };
        };
      in
      {
        checks = {
          pre-commit-check = pre-commit-check;
        };

        packages = {
          default = granola-cli;
          granola-cli = granola-cli;
          granola-cli-binary = fetchBinary pkgs system;
        };

        apps.default = {
          type = "app";
          program = "${granola-cli}/bin/granola";
        };

        devShells.default = pkgs.mkShell {
          inherit (pre-commit-check) shellHook;
          packages = with pkgs; [
            nodejs_26
            pnpm
          ];
        };
      }
    );
}
