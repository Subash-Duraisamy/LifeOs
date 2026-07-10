import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";

import "./AnalyticsPage.css";

function ExportSection() {

  function handlePDF() {

    alert("PDF Export will be added next.");

  }

  function handleExcel() {

    alert("Excel Export will be added next.");

  }

  function handleCSV() {

    alert("CSV Export will be added next.");

  }

  function handlePrint() {

    window.print();

  }

  return (

    <div className="export-section">

      <button
        className="export-btn pdf"
        onClick={handlePDF}
      >

        <FileText size={18} />

        PDF

      </button>

      <button
        className="export-btn excel"
        onClick={handleExcel}
      >

        <FileSpreadsheet size={18} />

        Excel

      </button>

      <button
        className="export-btn csv"
        onClick={handleCSV}
      >

        <Download size={18} />

        CSV

      </button>

      <button
        className="export-btn print"
        onClick={handlePrint}
      >

        <Printer size={18} />

        Print

      </button>

    </div>

  );

}

export default ExportSection;