import PixelField from '@/components/PixelField';

/** The name stays readable and selectable above the pointer-lit pixel field. */
export default function HeroName() {
  return (
    <div className="hero-heading-row">
      <PixelField />
      <h1 className="hero-name" id="hero-name" aria-label="Mohit Gujarati">
        <span className="name-line">
          <span>Mohit</span>
        </span>{' '}
        <span className="name-line">
          <span>
            Gujarati<span className="name-period">.</span>
          </span>
        </span>
      </h1>
    </div>
  );
}
