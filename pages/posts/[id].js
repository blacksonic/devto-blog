import Head from 'next/head';
import Layout from '../../components/layout';
import Date from '../../components/date';
import { getAllDevPostIds, getDevPost } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import hljs from 'highlight.js';
import { useEffect } from 'react';

export default function Post({ postData }) {
  useEffect(() => {
    hljs.initHighlighting();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.published_at} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.body_html }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllDevPostIds();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getDevPost(params.id);
  return {
    props: {
      postData,
    },
  };
}
