export default function Legend() {
  return (
    <div className="absolute left-4 md:right-[60px] md:w-fit md:bottom-5 bottom-35 p-2.5 bg-white rounded-md shadow z-10">
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
        Nilai indikator fasum kecamatan
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "200px",
            height: "20px",
            background:
              "linear-gradient(to right, #ffffcc, #a1dab4, #41b6c4, #2c7fb8, #253494)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Tidak Tersedia</div>
        <div>Baik</div>
      </div>
    </div>
  );
}
