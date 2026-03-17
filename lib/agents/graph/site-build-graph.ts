/**
 * LangGraph site build graph definition.
 * Connects all 7 nodes with conditional transitions.
 */

import { StateGraph, END } from "@langchain/langgraph";
import { SiteBuildStateAnnotation, type SiteBuildStateType } from "./site-build-state";
import { sitePlanningNode } from "./nodes/site-planning";
import { sharedSettingsNode } from "./nodes/shared-settings";
import { pagePlanningNode } from "./nodes/page-planning";
import { pageGenerationNode } from "./nodes/page-generation";
import { siteReviewNode } from "./nodes/site-review";
import { repairNode } from "./nodes/repair";
import { finalizeNode } from "./nodes/finalize";
import {
  routeAfterReview,
  routeAfterRepair,
  routeAfterPageGeneration,
} from "./transitions";

export function buildSiteBuildGraph() {
  const graph = new StateGraph(SiteBuildStateAnnotation)
    // Add all 7 nodes
    .addNode("site_planning", sitePlanningNode)
    .addNode("shared_settings", sharedSettingsNode)
    .addNode("page_planning", pagePlanningNode)
    .addNode("page_generation", pageGenerationNode)
    .addNode("site_review", siteReviewNode)
    .addNode("repair", repairNode)
    .addNode("finalize", finalizeNode)

    // Linear flow: START → site_planning → shared_settings → page_planning → page_generation
    .addEdge("__start__", "site_planning")
    .addEdge("site_planning", "shared_settings")
    .addEdge("shared_settings", "page_planning")
    .addEdge("page_planning", "page_generation")

    // After page generation: conditional → review or finalize (if all failed)
    .addConditionalEdges("page_generation", routeAfterPageGeneration, {
      site_review: "site_review",
      finalize: "finalize",
    })

    // After review: conditional → repair or finalize
    .addConditionalEdges("site_review", routeAfterReview, {
      repair: "repair",
      finalize: "finalize",
    })

    // After repair: conditional → re-review or finalize
    .addConditionalEdges("repair", routeAfterRepair, {
      site_review: "site_review",
      finalize: "finalize",
    })

    // Finalize → END
    .addEdge("finalize", END);

  return graph.compile();
}
