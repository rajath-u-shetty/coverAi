import { toast } from "@/components/ui/use-toast";
import { CoverLetter } from "@prisma/client";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


export const handleDownload = async (letter: CoverLetter) => {
    try {
      // Create a new div to hold the content
      const content = document.createElement('div');
      content.innerHTML = letter.content;

      // Apply styling to ensure proper rendering
      content.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 210mm;
      padding: 20mm;
      font-family: Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background-color: #fff;
    `;

      // Append the content to the body
      document.body.appendChild(content);

      // Wait for any potential asynchronous rendering
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate the canvas with improved settings
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create the PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / 2; // Scaling down due to canvas scaling
      const imgHeight = canvas.height / 2; // Scaling down due to canvas scaling

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
      heightLeft -= pdfHeight;

      // Handle multi-page PDF only if heightLeft is greater than 0
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        if (position < -pdfHeight) break; // Exit loop if there are no more content to add

        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      const filename = letter.fileName.split('.')[0];
      pdf.save(`${filename}.pdf`);

      // Clean up
      document.body.removeChild(content);

    } catch (error) {
      // Error handling
      console.error('Error generating PDF:', error);
      toast({
        title: 'Failed to download',
        description: 'An error occurred while generating the PDF. Please try again later.',
        variant: 'destructive',
      });
    }
  };

