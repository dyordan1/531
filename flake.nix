{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, systems, ...}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        gcloud = pkgs.google-cloud-sdk.withExtraComponents([pkgs.google-cloud-sdk.components.gke-gcloud-auth-plugin]);
      in
      {
        devShells.default = pkgs.mkShellNoCC {
          buildInputs = with pkgs; [
            # Infra
            git
            git-lfs
            pre-commit
            certbot

            # Docker
            docker-client
            colima

            # JS
            nodejs_23
          ];
        };
      }
    );
}
