export const seedSubmissions = [
  {
    id: 'sub_1042', applicant: { name: 'Alex Morgan', email: 'alex.morgan@example.com' }, group: { id: 'grp_northstar', name: 'Northstar Fabrication' }, product: 'Voluntary Life', coverageAmountCents: 25000000, submittedAt: '2026-11-01T08:30:00-05:00', effectiveDate: '2027-01-01', reviewReason: 'COVERAGE_MISMATCH', priority: 'HIGH', status: 'NEEDS_REVIEW',
    employee: { employeeId: 'NF-18402', dateOfBirth: '1988-09-14', address: '120 Market Street, Cleveland, OH' }, employment: { status: 'Active', hireDate: '2021-02-15', annualSalary: '$72,000' }, election: { coverageType: 'Employee', beneficiary: 'Jordan Morgan' }, existingCoverage: { amount: '$100,000', product: 'Basic Life' }, reviewSignals: [{ code: 'COVERAGE_MISMATCH', severity: 'WARNING', message: 'Requested coverage differs from the available evidence of existing coverage.' }],
  },
  {
    id: 'sub_1043', applicant: { name: 'Priya Shah', email: 'priya.shah@example.com' }, group: { id: 'grp_lakeside', name: 'Lakeside Logistics' }, product: 'Accident Insurance', coverageAmountCents: 450000, submittedAt: '2026-10-31T15:12:00-05:00', effectiveDate: '2027-01-01', reviewReason: 'MISSING_INFORMATION', priority: 'HIGH', status: 'NEEDS_REVIEW',
    employee: { employeeId: 'LL-8894', dateOfBirth: '' }, employment: { status: 'Active', hireDate: '2024-07-08' }, election: { coverageType: 'Employee + spouse', beneficiary: '' }, existingCoverage: {}, reviewSignals: [{ code: 'MISSING_DOB', severity: 'ERROR', message: 'Date of birth is required to complete enrollment.' }],
  },
  {
    id: 'sub_1044', applicant: { name: 'Marcus Lee', email: 'marcus.lee@example.com' }, group: { id: 'grp_northstar', name: 'Northstar Fabrication' }, product: 'Critical Illness', coverageAmountCents: 1500000, submittedAt: '2026-10-30T09:45:00-05:00', effectiveDate: '2027-01-01', reviewReason: 'CONFLICTING_INFORMATION', priority: 'MEDIUM', status: 'NEEDS_REVIEW',
    employee: { employeeId: 'NF-22177', dateOfBirth: '1992-01-30' }, employment: { status: 'Terminated', terminationDate: '2026-10-15' }, election: { coverageType: 'Employee' }, existingCoverage: { amount: '$0' }, reviewSignals: [{ code: 'EMPLOYMENT_STATUS', severity: 'WARNING', message: 'The employment record shows termination before the requested effective date.' }],
  },
  {
    id: 'sub_1045', applicant: { name: 'Elena Rodriguez', email: 'elena.rodriguez@example.com' }, group: { id: 'grp_lakeside', name: 'Lakeside Logistics' }, product: 'Hospital Indemnity', coverageAmountCents: 300000, submittedAt: '2026-10-29T13:00:00-05:00', effectiveDate: '2027-01-01', reviewReason: 'ELIGIBILITY_REVIEW', priority: 'LOW', status: 'NEEDS_REVIEW',
    employee: { employeeId: 'LL-7341', dateOfBirth: '1984-05-09' }, employment: { status: 'Active', hireDate: '2026-10-25' }, election: { coverageType: 'Employee' }, existingCoverage: {}, reviewSignals: [{ code: 'WAITING_PERIOD', severity: 'INFO', message: 'Employment start date may fall within the group waiting period.' }],
  }
];
