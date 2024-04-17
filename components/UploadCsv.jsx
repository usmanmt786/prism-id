"use client";
import { useRef, useState } from "react";
import QRCode from "qrcode.react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function UploadCSV() {
  const [csvData, setCsvData] = useState([]);
const [count,setCount]=useState(0)

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
          `<html><head><title>Prism Id Cards</title><script src='https://cdn.tailwindcss.com'></script></head><body class='flex flex-col items-center flex-wrap justify-center gap-2'>`
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

  const generatePdf = async () => {
    const pdf = new jsPDF('p', 'cm', [16.5, 25.5]); // Create a new PDF document with page size 5.5cm by 8.5cm
    const divWidth = 16.5; // Width of the div in cm
    const divHeight = 25.5; //

    for (let i = 0; i < csvData.length; i++) {
        const canvas = await html2canvas(document.getElementById(`image-${i}`), {
            width: divWidth * 37.795276, // Convert cm to pixels
            height: divHeight * 37.795276, // Convert cm to pixels
          });
      const imgData = canvas.toDataURL('image/jpeg'); // Convert canvas to base64 image data
      pdf.addImage(imgData, 'JPEG', 0, 0,divWidth, divHeight); // Add image to PDF document
      setCount(i)
      if (i !== csvData.length - 1) {
        pdf.addPage([16.5, 25.5]); // Add new page with the same size for the next image
      }
    }

    pdf.save('images.pdf'); // Download the PDF file
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {/* <input type="number" onChange={(e)=>setSize(e.target.value)} className="border-2 px-2 py-2 w-32" placeholder="size"/> */}
      <button className="border-2 bg-green-600 text-white px-4 py-2 " onClick={generatePdf}>
       {count>0 ? count : 'Print'}
      </button>
      <div className="flex flex-wrap justify-center gap-2 w-full" ref={idRef}>
        {csvData.map((item, i) => (
          <div key={i} className={`relative w-[16.5cm] h-[25.5cm]`} id={'image-'+i}>
            <img src="/MEMBERSHIP.jpg" alt="" className="w-full h-full" />
            <div className="absolute top-2/4 p-1 bg-white left-1/2 -translate-x-1/2 translate-y-7 w-[30%] qr-code">
              <QRCode
                value={item[2]}
                size="100%" // Adjust the size of the QR code as needed
                fgColor="#000" // Foreground color
                bgColor="#fff" // Background color
                level="H" // Error correction level: L, M, Q, H
                renderAs="svg" // Output format: svg, canvas
              />
            </div>

            <h2 className="text-2xl uppercase font-bold absolute top-3/4 translate-y-24 left-1/2 -translate-x-1/2 text-white w-[70%] text-center">
              {item[1]}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
