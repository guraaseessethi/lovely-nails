"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { ADMIN_TYPES, SINGLETONS, schemaTypes } from "./sanity/schemaTypes";
import { isAdmin, structure } from "./sanity/structure";

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "lovely-nails",
  title: "Lovely Nails Spa",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : actions,
    newDocumentOptions: (items, { currentUser }) =>
      items.filter((item) => {
        const type = item.templateId;
        if (SINGLETONS.includes(type)) return false;
        return isAdmin(currentUser) || !ADMIN_TYPES.includes(type);
      }),
  },
  apiVersion,
});
