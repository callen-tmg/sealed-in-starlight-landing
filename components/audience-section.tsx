const items = [
  "You've ever wished a fictional character would write you a letter",
  <>You devour romantasy books and want to <em>live inside</em> the world</>,
  "You love dark fae courts, morally grey love interests, and beautifully dangerous magic",
  "You want something physical, beautiful, and collectible — not another digital subscription",
  "You'd rather receive a wax-sealed letter than another Amazon package",
];

export function AudienceSection() {
  return (
    <section className="audience">
      <div className="container">
        <h2 className="section-title reveal">Written For You If...</h2>
        <div className="audience-list">
          {items.map((item, i) => (
            <div key={i} className="audience-item reveal">
              <span className="thorn">&#10045;</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
