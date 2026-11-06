import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { Post } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { type RawImage, toImg } from "@/lib/sanity/image";
import styles from "./PostArticle.module.css";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className={styles.h}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    normal: ({ children }) => <p className={styles.p}>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: NonNullable<RawImage> & { caption?: string } }) => {
      const img = toImg(value);
      if (!img) return null;
      return (
        <figure className={styles.figure}>
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(min-width: 820px) 680px, 100vw"
            placeholder={img.lqip ? "blur" : "empty"}
            blurDataURL={img.lqip}
            className={styles.img}
          />
          {value.caption && <figcaption className={styles.figcaption}>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

/** The post itself, shared by the modal and the full /journal/[slug] page. */
export function PostArticle({ post, phoneE164, as = "page" }: { post: Post; phoneE164?: string; as?: "page" | "modal" }) {
  const Title = as === "page" ? "h1" : "h2";
  return (
    <article className={styles.article} aria-labelledby="post-title">
      {post.cover && (
        <div className={styles.hero}>
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            priority={as === "page"}
            sizes="(min-width: 820px) 780px, 100vw"
            placeholder={post.cover.lqip ? "blur" : "empty"}
            blurDataURL={post.cover.lqip}
            style={{ objectFit: "cover", objectPosition: post.cover.position }}
          />
        </div>
      )}
      <div className={styles.body}>
        <p className="label">{[post.tag, formatDate(post.date)].filter(Boolean).join(" · ")}</p>
        <Title id="post-title" className={styles.title}>
          {post.title}
        </Title>
        {post.excerpt && <p className={styles.lede}>{post.excerpt}</p>}
        <PortableText value={post.body} components={components} />
        <div className={styles.foot}>
          <span className={styles.footNote}>Questions about this? Give us a call.</span>
          {phoneE164 && (
            <a href={`tel:${phoneE164}`} className="btn btnCyan">
              Call to book
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
