import { ClockIcon } from "@sanity/icons/Clock";
import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { SearchIcon } from "@sanity/icons/Search";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { CurrentUser } from "sanity";
import type { ListItemBuilder, StructureBuilder, StructureResolver } from "sanity/structure";

type Divider = ReturnType<StructureBuilder["divider"]>;

export const isAdmin = (user: Omit<CurrentUser, "role"> | null | undefined) =>
  Boolean(user?.roles.some((r) => r.name === "administrator"));

const singleton = (S: StructureBuilder, id: string, title: string, icon: typeof CogIcon) =>
  S.listItem()
    .id(id)
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(id).documentId(id).title(title));

/** April sees three items. Administrators also get an Admin folder. */
export const structure: StructureResolver = (S, context) => {
  const items: (ListItemBuilder | Divider)[] = [
    singleton(S, "workPhotos", "Work photos", ImagesIcon),
    S.documentTypeListItem("post").title("Journal").icon(DocumentTextIcon),
    singleton(S, "hours", "Hours and notices", ClockIcon),
  ];

  if (isAdmin(context.currentUser)) {
    items.push(
      S.divider(),
      S.listItem()
        .id("admin")
        .title("Admin")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Admin")
            .items([
              singleton(S, "siteSettings", "Site settings", CogIcon),
              S.documentTypeListItem("service").title("Services").icon(TagIcon),
              S.documentTypeListItem("review").title("Reviews").icon(CommentIcon),
              singleton(S, "about", "About April", UserIcon),
              singleton(S, "pageSeo", "Page SEO", SearchIcon),
              singleton(S, "backgrounds", "Section backgrounds", ImageIcon),
            ]),
        ),
    );
  }

  return S.list().title("Lovely Nails").items(items);
};
