{
    description = "Development environment for Pixel Battle (discord bot)";

    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
        flake-utils.url = "github:numtide/flake-utils";
    };

    outputs = { self, nixpkgs, flake-utils }:
        flake-utils.lib.eachDefaultSystem (system:
            let
                pkgs = import nixpkgs {
                    inherit system;
                };
            in
            {
                devShells.default = pkgs.mkShell {
                    packages = with pkgs; [
                        nodejs_24
                        yarn
                    ];
                };
            }
        );
}
