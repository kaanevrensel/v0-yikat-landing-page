import { serviceExpectations } from "@/lib/service-expectations"

export function ServiceExpectations() {
  return <section id="hizmet-bilgisi" className="service-expectations" aria-labelledby="expectations-title">
    <h2 id="expectations-title">Ücrete ve teslim gününe<br/>karar vermeden önce.</h2>
    <dl>{serviceExpectations.map(item => <div key={item.title}>
      <dt>{item.title}</dt><dd>{item.text}</dd>
    </div>)}</dl>
  </section>
}
