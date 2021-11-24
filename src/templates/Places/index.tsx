import { NextSeo } from 'next-seo';
import { CloseOutline } from '@styled-icons/evaicons-outline';
import LinkWrapper from 'components/LinkWrapper';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';

import * as S from './styles';

type ImageProps = {
  url: string;
  height: number;
  width: number;
};
export type PlacesTemplateProps = {
  place: {
    slug: string;
    name: string;
    description?: {
      html: string;
      text: string;
    };
    gallery: ImageProps[];
  };
};

export default function PlacesTemplate({ place }: PlacesTemplateProps) {
  const router = useRouter();

  if (router.isFallback) return null;

  return (
    <>
      <NextSeo
        title={`${place.name} - My Trips`}
        description={
          place.description?.text ||
          'A simple project to show my favorite spots in the world.'
        }
        canonical="https://my-trips.sandro.vercel.app"
        openGraph={{
          url: 'https://my-trips.sandro.vercel.app',
          title: 'My Trips',
          description:
            place.description?.text ||
            'A simple project to show my favorite spots in the world.',
          images: [
            {
              url: place.gallery[0].url,
              width: place.gallery[0].width,
              height: place.gallery[0].height,
              alt: `${place.name}`
            }
          ]
        }}
      />
      <LinkWrapper href="/">
        <CloseOutline size={32} aria-label="Voltar para o mapa" />
      </LinkWrapper>
      <S.Wrapper>
        <S.Container>
          <S.Heading>{place.name}</S.Heading>

          <S.Body
            dangerouslySetInnerHTML={{
              __html: place.description?.html || ''
            }}
          />
          <S.Gallery>
            {place.gallery.map((image, index) => (
              <Image
                key={`photo-${index}`}
                src={image.url}
                alt={place.name}
                width={1000}
                height={600}
                quality={75}
              />
            ))}
          </S.Gallery>
        </S.Container>
      </S.Wrapper>
    </>
  );
}
