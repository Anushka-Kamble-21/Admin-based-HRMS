import jsPDF from "jspdf";

export const generatePayslipPDF = ({ record, employee }) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Payslip", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.text("HRMS Payroll System", 105, 22, { align: "center" });

  doc.line(10, 26, 200, 26);

  let y = 35;

  doc.setFontSize(11);
  doc.text(`Employee Name: ${employee?.name}`, 10, y);
  doc.text(`Mode: ${record.mode}`, 140, y);

  y += 8;
  doc.text(`Period: ${record.fromDate} to ${record.toDate}`, 10, y);
  doc.text(`Status: ${record.status}`, 140, y);

  y += 12;
  doc.setFontSize(12);
  doc.text("Attendance Summary", 10, y);

  y += 6;
  doc.setFontSize(10);
  doc.text(`Working Days: ${record.workingDays}`, 10, y);
  doc.text(`Present Days: ${record.presentDays}`, 70, y);
  doc.text(`Paid Leaves: ${record.paidLeaves}`, 130, y);

  y += 8;
  doc.text(`Unpaid Leaves (LOP): ${record.unpaidLeaves}`, 10, y);

  y += 12;
  doc.setFontSize(12);
  doc.text("Salary Breakdown", 10, y);

  y += 6;
  doc.setFontSize(10);

  const rows = [
    ["Gross Salary", `₹ ${record.grossSalary}`],
    ["Per Day Salary", `₹ ${record.perDaySalary}`],
    ["LOP Deduction", `₹ ${record.lopAmount}`],
    ["Bonus", `₹ ${record.bonus}`],
    ["Other Deductions", `₹ ${record.otherDeductions}`],
  ];

  rows.forEach(([label, value]) => {
    doc.text(label, 10, y);
    doc.text(value, 140, y);
    y += 7;
  });

  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(12);
  doc.text("Net Salary", 10, y);
  doc.setFontSize(14);
  doc.text(`₹ ${record.netSalary}`, 140, y);

  y += 15;
  doc.setFontSize(9);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    10,
    y
  );

  doc.save(`Payslip_${employee?.name}_${record.fromDate}.pdf`);
};
