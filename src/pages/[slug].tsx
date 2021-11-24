import client from 'graphql/client';
import { GetPageBySlugQuery, GetPagesQuery } from 'graphql/generated/graphql';
import { GET_PAGES, GET_PAGE_BY_SLUG } from 'graphql/queries';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import PageTemplate, { PageTemplateProps } from 'templates/Pages';

export default function Page({ heading, body }: PageTemplateProps) {
  const router = useRouter();

  // retorna um loading, qq coisa enquanto está sendo criado
  if (router.isFallback) return null;

  return <PageTemplate heading={heading} body={body} />;
}

export async function getStaticPaths() {
  const { pages } = await client.request<GetPagesQuery>(GET_PAGES, {
    first: 3
  });

  const paths = pages.map(({ slug }) => ({
    params: { slug }
  }));

  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { page } = await client.request<GetPageBySlugQuery>(GET_PAGE_BY_SLUG, {
    slug: `${params?.slug}`
  });

  if (!page) return { notFound: true };

  return {
    revalidate: 5,
    props: {
      heading: page.heading,
      body: page.body.html
    }
  };
};

//getStaticPaths = serve para gerar as URL's em buil time Ex.: /about, /trip/itajubá
//getStaticProps = serve para buscar dados da pagina (props) - build time - estático
//getServerSideProps = serve para buscar dados da pagina (props) - runtime - toda requisição (bunhdle fica no server)
//getInitialProps = serve para buscar dados da pagina (props) - runtime - toda requisição (bunhdle tambem vem para o client) e permite o hydrate (NextJS já não recomenda muito)