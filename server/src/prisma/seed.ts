import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Nexus database...');

  // ─── Hash password helper ────────────────────────────────────────────────
  const hashPassword = (pwd: string) => bcrypt.hashSync(pwd, 12);

  // ─── 1. Create Users ─────────────────────────────────────────────────────
  console.log('  → Creating users...');

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.connor@nexus.internal' },
    update: {},
    create: {
      email: 'sarah.connor@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Sarah Connor',
      avatar: '5.png',
      role: 'SeniorAgent',
      status: 'online',
      team: 'Escalation Tier 2',
    },
  });

  const hiroshi = await prisma.user.upsert({
    where: { email: 'hiroshi.tanaka@nexus.internal' },
    update: {},
    create: {
      email: 'hiroshi.tanaka@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Hiroshi Tanaka',
      avatar: '3.png',
      role: 'TechnicalLead',
      status: 'online',
      team: 'API Engineering',
    },
  });

  const sophie = await prisma.user.upsert({
    where: { email: 'sophie.martin@nexus.internal' },
    update: {},
    create: {
      email: 'sophie.martin@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Sophie Martin',
      avatar: '4.png',
      role: 'FinanceOfficer',
      status: 'away',
      team: 'Finance Department',
    },
  });

  const ellen = await prisma.user.upsert({
    where: { email: 'ellen.ripley@nexus.internal' },
    update: {},
    create: {
      email: 'ellen.ripley@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Ellen Ripley',
      avatar: '8.png',
      role: 'Administrator',
      status: 'online',
      team: 'IT Ops',
    },
  });

  const john = await prisma.user.upsert({
    where: { email: 'john.doe@nexus.internal' },
    update: {},
    create: {
      email: 'john.doe@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'John Doe',
      avatar: '6.png',
      role: 'Agent',
      status: 'online',
      team: 'Support Team A',
    },
  });

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus.aurelius@nexus.internal' },
    update: {},
    create: {
      email: 'marcus.aurelius@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Marcus Aurelius',
      avatar: '7.png',
      role: 'ProjectManager',
      status: 'online',
      team: 'PMO Group',
    },
  });

  const luke = await prisma.user.upsert({
    where: { email: 'luke.skywalker@nexus.internal' },
    update: {},
    create: {
      email: 'luke.skywalker@nexus.internal',
      passwordHash: hashPassword('nexus2026!'),
      name: 'Luke Skywalker',
      avatar: '9.png',
      role: 'Trainee',
      status: 'online',
      team: 'Training Cohort',
    },
  });

  console.log(`  ✓ Created ${7} users`);

  // ─── 2. Create Clients ───────────────────────────────────────────────────
  console.log('  → Creating clients...');

  const paytech = await prisma.clientProfile.upsert({
    where: { email: 'm.dubois@paytech.fr' },
    update: {},
    create: {
      name: 'Marie Dubois',
      company: 'PayTech SAS',
      avatar: '1.png',
      status: 'FullAccess',
      email: 'm.dubois@paytech.fr',
      phone: '+33 1 47 20 00 01',
      country: 'France',
      city: 'Paris',
      timezone: 'Europe/Paris',
      localTime: 'Monday 3:21 PM CET',
      businessHoursNote: '🌙 Outside reasonable hours. Messaging preferred over calls.',
      vatNumber: 'FR123456789',
      identityVerification: 'Verified',
      verificationDetails: 'Full — Legal entity verified · Director ID verified · Bank account confirmed',
      contractStatus: '✅ MSA signed · NDA signed · SLA agreed',
      companyRegNo: 'SIRET 802 938 123 00019',
      language: 'French',
      additionalLanguages: JSON.stringify(["English", "German"]),
      totalRevenue: '€184,500.00',
      avgCsat: 4.8,
      npsScore: 9,
      paymentReliability: '✅ Always on time',
      flags: JSON.stringify(["VIP", "Enterprise", "NDA Signed"]),
      billingPrefs: {
        create: {
          contractType: 'Time & Materials',
          billingCycle: 'Monthly',
          paymentTerms: 'Net 30',
          autoInvoice: true,
          currency: 'EUR',
          vatRate: 20,
          withholdingTax: false,
          routingRules: {
            create: [
              {
                name: 'EU Subsidiary Split',
                condition: 'Project contains PayTech DE',
                destination: 'PayTech Germany GmbH',
                split: 40,
              },
            ],
          },
        },
      },
      childAccounts: {
        create: [
          { name: 'PayTech Germany GmbH', status: 'VERIFIED', type: 'GmbH', seats: 2, projects: 1, earnings: '€45,000' },
          { name: 'PayTech UK Ltd', status: 'VERIFIED', type: 'Ltd.', seats: 3, projects: 1, earnings: '€32,000' },
        ],
      },
      portalUsers: {
        create: [
          { name: 'Marie Dubois', role: 'Admin', lastLogin: '2 hours ago', twoFactor: true, permissionLevel: 'Full Access' },
          { name: 'Sophie Martin', role: 'Billing only', lastLogin: '1 day ago', twoFactor: true, permissionLevel: 'Billing' },
          { name: 'Pierre Leveque', role: 'Member', lastLogin: '3 days ago', twoFactor: false, permissionLevel: 'Read/Write' },
        ],
      },
    },
  });

  const defi = await prisma.clientProfile.upsert({
    where: { email: 'liam@defilabs.io' },
    update: {},
    create: {
      name: "Liam O'Connor",
      company: 'DeFi Labs Ltd',
      avatar: '2.png',
      status: 'Restricted',
      email: 'liam@defilabs.io',
      phone: '+353 1 601 2345',
      country: 'Ireland',
      city: 'Dublin',
      timezone: 'Europe/Dublin',
      localTime: 'Monday 2:21 PM GMT',
      businessHoursNote: '🟢 Within business hours.',
      vatNumber: 'IE9876543A',
      identityVerification: 'Verified',
      verificationDetails: 'Legal entity verified · Multi-sig wallet address validated',
      contractStatus: '✅ MSA signed · NDA signed · SLA agreed',
      companyRegNo: 'REG 543210',
      language: 'English',
      additionalLanguages: JSON.stringify(["Spanish"]),
      totalRevenue: '$240,000.00',
      avgCsat: 4.6,
      npsScore: 8,
      paymentReliability: '✅ Always on time',
      flags: JSON.stringify(["High Risk", "Overdue Invoices"]),
      billingPrefs: {
        create: {
          contractType: 'Fixed price',
          billingCycle: 'Milestone-based',
          paymentTerms: 'Net 15',
          autoInvoice: false,
          currency: 'USD',
          vatRate: 0,
          withholdingTax: true,
        },
      },
      portalUsers: {
        create: [
          { name: "Liam O'Connor", role: 'Admin', lastLogin: '10 min ago', twoFactor: true, permissionLevel: 'Full Access' },
          { name: 'Devon Miller', role: 'Member', lastLogin: '2 days ago', twoFactor: true, permissionLevel: 'Read/Write' },
        ],
      },
    },
  });

  console.log(`  ✓ Created 2 clients`);

  // ─── 3. Create Projects ──────────────────────────────────────────────────
  console.log('  → Creating projects...');

  const paytechProject = await prisma.project.upsert({
    where: { code: 'PRJ-PAY01' },
    update: {},
    create: {
      name: 'PayTech Portal',
      code: 'PRJ-PAY01',
      serviceType: 'Fintech',
      status: 'OnTrack',
      thumbnail: '11.png',
      startDate: 'Mar 15, 2026',
      endDate: 'Sep 15, 2026',
      durationWeeks: 26,
      locationType: 'Remote · 4 developers · 2 designers',
      teamSize: '6',
      contractType: 'TimeAndMaterials',
      contractPhase: 'Phase 2 of 4',
      contractValue: '€120,000.00',
      teamLead: 'Hiroshi Tanaka',
      clientId: paytech.id,
      milestones: {
        create: [
          { name: 'Wireframes & Interactive Prototypes', due: 'Apr 10, 2026', status: 'Delivered', signoff: 'Marie Dubois' },
          { name: 'Sprint 1 Web UI Build', due: 'May 20, 2026', status: 'Delivered', signoff: 'Marie Dubois' },
          { name: 'Sprint 2 Payment Engine Hookup', due: 'Jul 05, 2026', status: 'Pending', signoff: 'Pending' },
        ],
      },
      deployments: {
        create: [
          { env: 'Staging', version: 'v1.2.0-rc3', by: 'Emma Watson', date: 'Jun 14, 2026', status: 'Staging', rollback: false },
          { env: 'Production', version: 'v1.1.0', by: 'Emma Watson', date: 'May 02, 2026', status: 'Live', rollback: true },
        ],
      },
      repos: {
        create: [
          { name: 'github.com/paytech-labs/portal-fe', branch: 'main', commit: '8f92d41', prs: 2, ci: 'Passing', coverage: 87 },
          { name: 'github.com/paytech-labs/core-payment-api', branch: 'main', commit: '3a4f10e', prs: 0, ci: 'Passing', coverage: 94 },
        ],
      },
      qaRuns: {
        create: [
          { suite: 'Frontend E2E Tests', date: 'Jun 17, 2026', passed: 142, failed: 0, coverage: 82, reportUrl: '#' },
          { suite: 'API Security Penetration', date: 'May 28, 2026', passed: 45, failed: 2, coverage: 100, reportUrl: '#' },
        ],
      },
      timelines: {
        create: [
          { phase: 'Discovery & UX Design', duration: '4 weeks', teamSize: 3, status: 'Completed', progress: 100 },
          { phase: 'Frontend Core Integration', duration: '8 weeks', teamSize: 5, status: 'In progress', progress: 65 },
          { phase: 'API Gateway & Security', duration: '8 weeks', teamSize: 4, status: 'Upcoming', progress: 0 },
          { phase: 'Beta QA & Launch', duration: '6 weeks', teamSize: 6, status: 'Upcoming', progress: 0 },
        ],
      },
    },
  });

  const defiProject = await prisma.project.upsert({
    where: { code: 'PRJ-ETH02' },
    update: {},
    create: {
      name: 'EtherDeFi Smart Contract',
      code: 'PRJ-ETH02',
      serviceType: 'Blockchain',
      status: 'AtRisk',
      thumbnail: '13.png',
      startDate: 'May 01, 2026',
      endDate: 'Aug 15, 2026',
      durationWeeks: 15,
      locationType: 'Remote · 2 developers',
      teamSize: '2',
      contractType: 'FixedPrice',
      contractPhase: 'Phase 1 of 2',
      contractValue: '$80,000.00',
      teamLead: 'Alex Rivera',
      clientId: defi.id,
      milestones: {
        create: [
          { name: 'ERC-20 Staking Protocol Draft', due: 'May 20, 2026', status: 'Delivered', signoff: "Liam O'Connor" },
          { name: 'Hardhat Local Environment Deployment', due: 'Jun 18, 2026', status: 'At risk', signoff: 'Pending' },
        ],
      },
      deployments: {
        create: [
          { env: 'Testnet (Sepolia)', version: 'v0.1.0-alpha', by: 'Alex Rivera', date: 'Jun 10, 2026', status: 'Live', rollback: false },
        ],
      },
      repos: {
        create: [
          { name: 'github.com/defilabs-io/staking-contracts', branch: 'dev', commit: '2e98fa1', prs: 1, ci: 'Failing', coverage: 71 },
        ],
      },
      qaRuns: {
        create: [
          { suite: 'Solidity Compiler Tests', date: 'Jun 15, 2026', passed: 24, failed: 1, coverage: 78, reportUrl: '#' },
        ],
      },
      timelines: {
        create: [
          { phase: 'Protocol Architecture Design', duration: '3 weeks', teamSize: 2, status: 'Completed', progress: 100 },
          { phase: 'Smart Contract Coding', duration: '6 weeks', teamSize: 2, status: 'In progress', progress: 40 },
          { phase: 'Auditing & Security Hardening', duration: '6 weeks', teamSize: 3, status: 'Upcoming', progress: 0 },
        ],
      },
    },
  });

  console.log(`  ✓ Created 2 projects`);

  // ─── 4. Create Tickets ───────────────────────────────────────────────────
  console.log('  → Creating tickets...');

  const ticket1 = await prisma.ticket.create({
    data: {
      subject: 'Critical: Production payment gateway failing with 504 Gateway Timeout',
      status: 'Open',
      priority: 'Urgent',
      clientId: paytech.id,
      clientName: 'Marie Dubois',
      clientCompany: 'PayTech SAS',
      clientAvatar: '1.png',
      clientOutsideHours: true,
      assignedToId: sarah.id,
      assignedToName: 'Sarah Connor',
      assignedTeam: 'Escalation Tier 2',
      projectId: paytechProject.id,
      projectName: 'PayTech Portal',
      projectService: 'Fintech',
      projectThumb: '11.png',
      lastMessage: 'We are seeing sporadic 504 Gateway Timeouts on our checkout endpoint in production.',
      lastMessageTime: '10 mins ago',
      messages: {
        create: [
          {
            senderId: null,
            senderName: 'Marie Dubois',
            avatar: '1.png',
            role: 'Client CEO',
            content: 'We are seeing sporadic 504 Gateway Timeouts on our checkout endpoint (POST /api/v1/charge) in production. This is affecting about 15% of our traffic during peak loads. We need this investigated urgently.',
            isInternal: false,
          },
          {
            senderId: sarah.id,
            senderName: 'Sarah Connor',
            avatar: '5.png',
            role: 'SeniorAgent',
            content: 'I am assigning this ticket to myself and bringing in the API & Backend Team Lead. We will check the production application logs and proxy configurations immediately.',
            isInternal: false,
          },
          {
            senderId: sarah.id,
            senderName: 'Sarah Connor',
            avatar: '5.png',
            role: 'SeniorAgent',
            content: 'Internal Note: Nginx is timing out waiting for the upstream Node.js container. CPU utilization spikes to 95% on backend-01. Likely an un-indexed database query or database lock. Paging Hiroshi.',
            isInternal: true,
          },
        ],
      },
      annotations: {
        create: [
          {
            agentId: sarah.id,
            agentName: 'Sarah Connor',
            avatar: '5.png',
            text: 'Accessed for training purposes. Checked production dashboard settings.',
          },
        ],
      },
    },
  });

  await prisma.ticket.create({
    data: {
      subject: 'Gas optimization review for ERC-20 staking contract',
      status: 'InProgress',
      priority: 'Medium',
      clientId: defi.id,
      clientName: "Liam O'Connor",
      clientCompany: 'DeFi Labs Ltd',
      clientAvatar: '2.png',
      clientOutsideHours: false,
      assignedToId: hiroshi.id,
      assignedToName: 'Hiroshi Tanaka',
      assignedTeam: 'Blockchain & Web3 Dev',
      projectId: defiProject.id,
      projectName: 'EtherDeFi Smart Contract',
      projectService: 'Blockchain',
      projectThumb: '13.png',
      lastMessage: "Can we review the gas consumption on the stake() function?",
      lastMessageTime: '3 hours ago',
      messages: {
        create: [
          {
            senderId: null,
            senderName: "Liam O'Connor",
            avatar: '2.png',
            role: 'Client CEO',
            content: "Can we review the gas consumption on the stake() function? It seems to exceed normal levels under high network congestion. Let's schedule a code review.",
            isInternal: false,
          },
        ],
      },
    },
  });

  console.log(`  ✓ Created 2 tickets`);

  // ─── 5. Create Invoices ──────────────────────────────────────────────────
  console.log('  → Creating invoices...');

  await prisma.invoice.createMany({
    data: [
      { clientId: paytech.id, projectName: 'PayTech Portal', amount: '€20,000.00', dueDate: '2026-07-15', status: 'Pending' },
      { clientId: paytech.id, projectName: 'PayTech Portal', amount: '€35,000.00', dueDate: '2026-06-15', status: 'Paid' },
      { clientId: defi.id, projectName: 'EtherDeFi Smart Contract', amount: '$40,000.00', dueDate: '2026-06-10', status: 'Overdue' },
      { clientId: paytech.id, projectName: 'PayTech Portal', amount: '€15,000.00', dueDate: '2026-05-15', status: 'Paid' },
    ]
  });

  console.log(`  ✓ Created 4 invoices`);

  // ─── 6. Create Notifications ─────────────────────────────────────────────
  console.log('  → Creating notifications...');

  await prisma.notification.createMany({
    data: [
      { userId: sarah.id, type: 'Alert', title: 'SLA breach warning — Ticket #TCK-9481', content: 'Urgent ticket response deadline is in 1 hour.', read: false },
      { userId: sarah.id, type: 'Update', title: 'Deployment completed for PayTech Portal', content: 'v1.2.0-rc3 deployed successfully to Staging by Emma Watson.', read: true },
      { userId: sarah.id, type: 'Reminder', title: 'Sprint review meeting in 30 minutes', content: 'PayTech Portal Sprint review with client CEO Marie Dubois.', read: false },
      { userId: sarah.id, type: 'Update', title: 'Invoice overdue', content: '$40,000.00 overdue for DeFi Labs Ltd.', read: true },
    ]
  });

  console.log(`  ✓ Created notifications`);

  // ─── 7. Create Reminders ─────────────────────────────────────────────────
  console.log('  → Creating reminders...');

  await prisma.reminder.createMany({
    data: [
      { userId: sarah.id, title: 'Verify Nginx log settings', dueDate: 'Tomorrow at 9:00 AM', entityType: 'ticket', entityId: ticket1.id, entityName: ticket1.subject.substring(0, 20), priority: 'urgent', completed: false },
      { userId: sarah.id, title: 'Prepare invoice summaries for Q2', dueDate: 'Jun 22, 2026', entityType: 'invoice', entityId: 'INV', entityName: 'INV-2026-002', priority: 'medium', completed: false },
    ]
  });

  console.log(`  ✓ Created reminders`);

  // ─── 8. Create Knowledge Articles ────────────────────────────────────────
  console.log('  → Creating knowledge articles...');

  await prisma.knowledgeArticle.createMany({
    data: [
      {
        title: 'How to handle 504 Gateway Timeout errors',
        category: 'Technical',
        isLocked: false,
        description: 'Step-by-step guide to diagnose and resolve 504 Gateway Timeout errors in production.',
        tags: JSON.stringify(['billing', 'invoices', 'payment', 'stripe']),
        body: '## Diagnosing 504 errors\n\n1. Check Nginx upstream logs\n2. Review Node.js process CPU and memory\n3. Check database connection pool\n4. Review slow query logs\n\n## Common causes\n\n- Un-indexed database queries\n- Database connection pool exhaustion\n- Upstream service down\n- Network connectivity issues',
        author: 'Hiroshi Tanaka',
        authorAvatar: '3.png',
        views: 42,
      },
      {
        title: 'Smart Contract Gas Optimization Best Practices',
        category: 'Blockchain',
        isLocked: false,
        description: 'Techniques to reduce gas consumption in Solidity smart contracts.',
        tags: JSON.stringify(['solidity', 'gas', 'optimization', 'erc20']),
        body: '## Key Optimization Techniques\n\n1. Use `uint256` instead of smaller uint types\n2. Pack storage variables\n3. Use `calldata` instead of `memory` for external function parameters\n4. Avoid on-chain storage where possible\n\n## Profiling Tools\n\n- Hardhat Gas Reporter\n- eth-gas-reporter\n- Tenderly',
        author: 'Hiroshi Tanaka',
        authorAvatar: '3.png',
        views: 28,
      },
      {
        title: 'SLA Escalation Procedures',
        category: 'Processes',
        isLocked: true,
        description: 'Internal guide for handling SLA breach escalations.',
        tags: JSON.stringify(['api', 'rate-limits', 'errors', 'developer']),
        body: '## Tier 1: Response SLA (< 1 hour)\n\nAssign ticket, send acknowledgment to client.\n\n## Tier 2: Resolution SLA (< 4 hours for urgent)\n\nEscalate to Senior Agent or TL.\n\n## Tier 3: Executive Escalation\n\nNotify Account Manager and PM. Send client-facing status update.',
        author: 'Ellen Ripley',
        authorAvatar: '8.png',
        views: 156,
      },
      {
        title: 'Client Onboarding Checklist',
        category: 'Processes',
        isLocked: false,
        description: 'Complete checklist for onboarding new enterprise clients.',
        tags: JSON.stringify(['onboarding', 'auth', 'sso', 'setup']),
        body: '## Pre-onboarding\n\n- [ ] MSA signed\n- [ ] NDA signed\n- [ ] SLA agreed\n- [ ] Identity verification completed\n\n## Technical Setup\n\n- [ ] Portal account created\n- [ ] 2FA enabled\n- [ ] API keys provisioned\n- [ ] Webhook endpoints configured',
        author: 'Sarah Connor',
        authorAvatar: '5.png',
        views: 89,
      },
    ],
  });

  console.log(`  ✓ Created knowledge articles`);

  // ─── 9. Create default user settings ────────────────────────────────────
  console.log('  → Creating user settings...');
  const allUsers = [sarah, hiroshi, sophie, ellen, john, marcus, luke];
  for (const user of allUsers) {
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
  }
  console.log(`  ✓ Created settings for ${allUsers.length} users`);

  console.log('\n✅ Seeding complete!');
  console.log('\n📋 Login credentials (all use password: nexus2026!)');
  console.log('  Administrator : ellen.ripley@nexus.internal');
  console.log('  Senior Agent  : sarah.connor@nexus.internal');
  console.log('  Tech Lead     : hiroshi.tanaka@nexus.internal');
  console.log('  Finance       : sophie.martin@nexus.internal');
  console.log('  PM            : marcus.aurelius@nexus.internal');
  console.log('  Agent         : john.doe@nexus.internal');
  console.log('  Trainee       : luke.skywalker@nexus.internal');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
