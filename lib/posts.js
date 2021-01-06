import axios from 'axios';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const apiKey = process.env.DEVTO_API_KEY;

export async function getSortedDevPosts() {
  const response = await axios.get('https://dev.to/api/articles/me', {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  console.log(response.data);

  const posts = response.data.map(
    ({ id, title, slug, published_at, flare_tag }) => {
      return {
        id,
        title,
        slug,
        published_at,
        flare_tag: flare_tag ? flare_tag : {},
      };
    },
  );

  const articles = posts.filter((post) => post.flare_tag.name !== 'discuss');

  return articles.sort((a, b) =>
    new Date(a.published_at) < new Date(b.published_at) ? 1 : -1,
  );
}

export async function getAllDevPostIds() {
  const posts = await getSortedDevPosts();

  return posts.map((post) => {
    return {
      params: {
        id: post.id.toString(),
      },
    };
  });
}

export async function getDevPost(id) {
  const response = await axios.get(`https://dev.to/api/articles/${id}`, {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  const { published_at, title, body_markdown } = response.data;
  const matterResult = matter(body_markdown);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const bodyHtml = processedContent.toString();

  return { id, published_at, title, body_html: bodyHtml };
}
