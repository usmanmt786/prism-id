"use client";
import { useRef, useState } from "react";
import QRCode from "qrcode.react";

export default function UploadCSV() {
  const [csvData, setCsvData] = useState([]);
// const [size,setSize]=useState()
// const width= size ? `w-[${size}cm]` : 'w-[6cm]'
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const lines = contents.split("\n").map((line) => line.replace(/"/g, ""));
      const data = lines.map((line) => line.split(","));

      setCsvData(data.slice(1));
    };

    reader.readAsText(file);
  };
  const idRef = useRef(null);
  const handlePrint = () => {
    const idCont = idRef.current;

    if (idCont) {
      const printContents = idCont.innerHTML;

      // Open a new window
      const newWindow = window.open("", "_blank");

      // If new window is opened, proceed with printing
      if (newWindow) {
        newWindow.document.write(
          `<html><head><title>Prism Id Cards</title><script src='https://cdn.tailwindcss.com'></script></head><body class='flex flex-wrap justify-center gap-2'>`
        );
        newWindow.document.write(printContents);
        newWindow.document.write("</body></html>");
        newWindow.document.close();
      } else {
        // Handle if pop-up is blocked or unable to open new window
        console.error("Unable to open new window for printing.");
      }
    } else {
      // Handle if the container div is not found or null
      console.error("Container div not found.");
    }
  };
  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {/* <input type="number" onChange={(e)=>setSize(e.target.value)} className="border-2 px-2 py-2 w-32" placeholder="size"/> */}
      <button className="border-2 bg-green-600 text-white px-4 py-2 " onClick={handlePrint}>
        Print
      </button>
      <div className="flex flex-wrap justify-center gap-2 w-full" ref={idRef}>
        {csvData.map((item, i) => (
          <div key={i} className={`relative w-[5.5cm] h-[8.5cm]`} >
            <img src="/MEMBERSHIP.jpg" alt="" className="w-full h-full" />
            <div className="absolute top-1/4 p-1 bg-white left-1/2 -translate-x-1/2 translate-y-24 w-[30%] qr-code">
              <QRCode
                value={item[2]}
                size="100%" // Adjust the size of the QR code as needed
                fgColor="#000" // Foreground color
                bgColor="#fff" // Background color
                level="H" // Error correction level: L, M, Q, H
                renderAs="svg" // Output format: svg, canvas
              />
            </div>

            <h2 className="text-[70%] uppercase font-bold absolute top-3/4 translate-y-8 left-1/2 -translate-x-1/2 text-white w-[70%] text-center">
              {item[1]}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
