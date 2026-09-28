import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { GeneratedDocument } from '../types';

/**
 * Downloads a string as a plain-text file.
 */
export function exportToTXT(doc: GeneratedDocument) {
  let text = '';
  text += `${doc.title.toUpperCase()}\n`;
  text += `Document Type: ${doc.document_type}\n`;
  text += `Effective Date: ${doc.metadata.effective_date}\n`;
  text += `Jurisdiction: ${doc.metadata.jurisdiction}\n`;
  text += `Governing Law: ${doc.metadata.governing_law}\n`;
  text += '='.repeat(70) + '\n\n';

  text += 'PARTIES:\n';
  doc.parties.forEach((p, idx) => {
    text += `${idx + 1}. ${p.name} (${p.role})\n`;
    text += `   Legal Type: ${p.legal_type}\n`;
    text += `   Address: ${p.address}\n\n`;
  });

  if (doc.recitals && doc.recitals.length > 0) {
    text += 'RECITALS:\n';
    doc.recitals.forEach((r) => {
      text += `${r}\n\n`;
    });
  }

  text += 'NOW, THEREFORE, the parties agree as follows:\n\n';

  doc.sections.forEach((s) => {
    text += `${s.heading}\n`;
    text += `${s.content}\n\n`;
  });

  text += 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement:\n\n';

  doc.signatures.forEach((sig) => {
    text += `PARTY: ${sig.party_name} (${sig.role})\n`;
    text += `Signature: __________________________\n`;
    text += `Name: ${sig.signatory_name || sig.party_name}\n`;
    text += `Title: ${sig.signatory_title || 'Authorized Agent'}\n`;
    text += `Date: ${sig.date || '__________________'}\n\n`;
  });

  text += '\n' + '='.repeat(70) + '\n';
  text += `${doc.metadata.disclaimer}\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(doc.title)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a native Microsoft Word (.docx) document using the `docx` library.
 */
export async function exportToDOCX(doc: GeneratedDocument) {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: doc.title.toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 100 },
    })
  );

  // Subtitle / Metadata
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Jurisdiction: ${doc.metadata.jurisdiction} | Effective Date: ${doc.metadata.effective_date}`,
          italics: true,
          size: 20,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Parties Header
  children.push(
    new Paragraph({
      text: 'PARTIES TO THIS AGREEMENT',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
    })
  );

  doc.parties.forEach((p) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `• ${p.name} `, bold: true }),
          new TextRun({ text: `(${p.role}, ${p.legal_type}) residing at or having an office at: ` }),
          new TextRun({ text: p.address, italics: true }),
        ],
        spacing: { after: 100 },
      })
    );
  });

  // Recitals
  if (doc.recitals && doc.recitals.length > 0) {
    children.push(
      new Paragraph({
        text: 'RECITALS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
      })
    );

    doc.recitals.forEach((r) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: r, italics: true })],
          spacing: { after: 120 },
        })
      );
    });
  }

  // Agreement Header
  children.push(
    new Paragraph({
      text: 'OPERATIVE TERMS AND CONDITIONS',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );

  // Sections
  doc.sections.forEach((s) => {
    children.push(
      new Paragraph({
        text: s.heading,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 80 },
      })
    );
    children.push(
      new Paragraph({
        text: s.content,
        spacing: { after: 200 },
      })
    );
  });

  // Signatures
  children.push(
    new Paragraph({
      text: 'EXECUTION & SIGNATURES',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    })
  );

  doc.signatures.forEach((sig) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `For and on behalf of: ${sig.party_name} (${sig.role})`, bold: true }),
        ],
        spacing: { before: 160, after: 100 },
      })
    );
    children.push(
      new Paragraph({
        text: 'Signature: ____________________________________',
        spacing: { after: 80 },
      })
    );
    children.push(
      new Paragraph({
        text: `Printed Name: ${sig.signatory_name || sig.party_name}`,
        spacing: { after: 80 },
      })
    );
    children.push(
      new Paragraph({
        text: `Title: ${sig.signatory_title || 'Authorized Representative'}`,
        spacing: { after: 80 },
      })
    );
    children.push(
      new Paragraph({
        text: `Date: ${sig.date || '________________________'}`,
        spacing: { after: 240 },
      })
    );
  });

  // Disclaimer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: doc.metadata.disclaimer,
          size: 16,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 400 },
    })
  );

  const docFile = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(docFile);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(doc.title)}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a clean, printable PDF legal document using jsPDF.
 */
export function exportToPDF(doc: GeneratedDocument) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 55;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      pdf.addPage();
      cursorY = 55;
    }
  };

  // Title
  pdf.setFont('times', 'bold');
  pdf.setFontSize(15);
  const titleLines = pdf.splitTextToSize(doc.title.toUpperCase(), contentWidth);
  pdf.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 18 + 8;

  // Metadata
  pdf.setFont('times', 'italic');
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  const metaText = `Effective Date: ${doc.metadata.effective_date} | Jurisdiction: ${doc.metadata.jurisdiction} | Law: ${doc.metadata.governing_law}`;
  pdf.text(metaText, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 20;

  // Rule
  pdf.setDrawColor(20, 20, 20);
  pdf.setLineWidth(1.2);
  pdf.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 18;

  // Parties
  pdf.setTextColor(15, 23, 42);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(11);
  pdf.text('PARTIES TO THIS AGREEMENT', margin, cursorY);
  cursorY += 15;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(9.5);
  doc.parties.forEach((p) => {
    checkPageBreak(25);
    const pLine = `• ${p.name} (${p.role}, ${p.legal_type}) – Registered Address: ${p.address}`;
    const splitLines = pdf.splitTextToSize(pLine, contentWidth);
    pdf.text(splitLines, margin, cursorY);
    cursorY += splitLines.length * 13 + 3;
  });
  cursorY += 8;

  // Recitals
  if (doc.recitals && doc.recitals.length > 0) {
    checkPageBreak(35);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    pdf.text('RECITALS', margin, cursorY);
    cursorY += 15;

    pdf.setFont('times', 'italic');
    pdf.setFontSize(9.5);
    doc.recitals.forEach((r) => {
      const rLines = pdf.splitTextToSize(r, contentWidth);
      checkPageBreak(rLines.length * 13 + 6);
      pdf.text(rLines, margin, cursorY);
      cursorY += rLines.length * 13 + 5;
    });
    cursorY += 8;
  }

  // Operative Sections
  checkPageBreak(35);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(11);
  pdf.text('OPERATIVE TERMS AND CONDITIONS', margin, cursorY);
  cursorY += 16;

  doc.sections.forEach((sec) => {
    checkPageBreak(40);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text(sec.heading, margin, cursorY);
    cursorY += 14;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.5);
    const cLines = pdf.splitTextToSize(sec.content, contentWidth);
    checkPageBreak(cLines.length * 13 + 8);
    pdf.text(cLines, margin, cursorY);
    cursorY += cLines.length * 13 + 10;
  });

  // Signatures
  checkPageBreak(100);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(11);
  pdf.text('EXECUTION AND SIGNATURES', margin, cursorY);
  cursorY += 18;

  doc.signatures.forEach((sig) => {
    checkPageBreak(65);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(9.5);
    pdf.text(`Party: ${sig.party_name} (${sig.role})`, margin, cursorY);
    cursorY += 13;

    pdf.setFont('times', 'normal');
    pdf.text('Signature: ___________________________________', margin, cursorY);
    cursorY += 13;
    pdf.text(
      `Printed Name: ${sig.signatory_name || sig.party_name}   Title: ${sig.signatory_title || 'Authorized Agent'}`,
      margin,
      cursorY
    );
    cursorY += 13;
    pdf.text(`Date: ${sig.date || '___________________'}`, margin, cursorY);
    cursorY += 18;
  });

  // Disclaimer
  checkPageBreak(35);
  pdf.setDrawColor(210, 210, 210);
  pdf.setLineWidth(0.5);
  pdf.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 12;

  pdf.setFont('times', 'italic');
  pdf.setFontSize(7.5);
  pdf.setTextColor(110, 110, 110);
  const discLines = pdf.splitTextToSize(doc.metadata.disclaimer, contentWidth);
  pdf.text(discLines, margin, cursorY);

  pdf.save(`${slugify(doc.title)}.pdf`);
}

/**
 * Triggers the system print dialog for physical printing.
 */
export function printDocument() {
  window.print();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
