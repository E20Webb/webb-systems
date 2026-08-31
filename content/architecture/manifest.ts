import IdentityArchitecture from "./identity-architecture.mdx";
import GenreTaxonomyArchitecture from "./genre-taxonomy-architecture.mdx";
import CatalogArchitecture from "./catalog-architecture.mdx";
import TasteGraphProblemArchitecture from "./taste-graph-problem-architecture.mdx";
import StudioIdentityArchitecture from "./studio-identity-architecture.mdx";
import CulturalInfrastructureArchitecture from "./cultural-infrastructure-architecture.mdx";
import ReleaseCadenceArchitecture from "./release-cadence-architecture.mdx";

export const architecture = {
  "identity-architecture": IdentityArchitecture,
  "genre-taxonomy-architecture": GenreTaxonomyArchitecture,
  "catalog-architecture": CatalogArchitecture,
  "taste-graph-problem-architecture": TasteGraphProblemArchitecture,
  "studio-identity-architecture": StudioIdentityArchitecture,
  "cultural-infrastructure-architecture": CulturalInfrastructureArchitecture,
  "release-cadence-architecture": ReleaseCadenceArchitecture,
};

export type ArchitectureSlug = keyof typeof architecture;
