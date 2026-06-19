import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'Agent' | 'Senior Agent' | 'Project Manager' | 'Technical Lead' | 'Finance Officer' | 'Administrator' | 'Trainee';
  status: 'online' | 'away' | 'dnd' | 'offline';
  team: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Pending Review' | 'Resolved' | 'Closed';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientAvatar: string;
  clientOutsideHours: boolean;
  assignedTo: string;
  assignedTeam: string;
  projectId: string;
  projectName: string;
  projectService: 'Fintech' | 'Web App' | 'Mobile App' | 'Blockchain' | 'AI/ML' | 'API' | 'DevOps';
  projectThumb: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Array<{
    id: string;
    sender: string;
    avatar: string;
    role: string;
    content: string;
    time: string;
    isInternal: boolean;
  }>;
  annotations: Array<{
    id: string;
    agentName: string;
    avatar: string;
    text: string;
    time: string;
  }>;
  createdTime: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  serviceType: 'Fintech' | 'Web App' | 'Mobile App' | 'Blockchain' | 'AI/ML' | 'API' | 'DevOps';
  status: 'On track' | 'At risk' | 'Off track' | 'On hold' | 'Completed' | 'In proposal';
  thumbnail: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  locationType: string;
  teamSize: string;
  contractType: 'Fixed price' | 'Time & Materials' | 'Retainer' | 'Hybrid';
  contractPhase: string;
  contractValue: string;
  teamLead: string;
  timeline: Array<{ phase: string; duration: string; teamSize: number; status: string; progress: number }>;
  milestones: Array<{ name: string; due: string; status: string; signoff: string }>;
  deployments: Array<{ env: string; version: string; by: string; date: string; status: string; rollback: boolean }>;
  repos: Array<{ name: string; branch: string; commit: string; prs: number; ci: string; coverage: number }>;
  qaRuns: Array<{ suite: string; date: string; passed: number; failed: number; coverage: number; reportUrl: string }>;
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  avatar: string;
  status: 'Full access' | 'Restricted' | 'Suspended';
  email: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  localTime: string;
  businessHoursNote: string;
  vatNumber: string;
  identityVerification: 'Verified' | 'Pending' | 'Not verified';
  verificationDetails: string;
  contractStatus: string;
  companyRegNo: string;
  creationDate: string;
  lastLogin: string;
  language: string;
  additionalLanguages: string[];
  totalRevenue: string;
  avgCsat: number;
  npsScore: number;
  paymentReliability: string;
  flags: string[];
  childAccounts: Array<{ name: string; status: string; type: string; seats: number; projects: number; earnings: string }>;
  portalUsers: Array<{ name: string; role: string; lastLogin: string; twoFactor: boolean; permissionLevel: string }>;
  billingPrefs: {
    contractType: string;
    billingCycle: string;
    paymentTerms: string;
    autoInvoice: boolean;
    currency: string;
    vatRate: number;
    withholdingTax: boolean;
    routingRules: Array<{ id: string; name: string; condition: string; destination: string; split: number }>;
  };
}

export interface Invoice {
  id: string;
  projectId: string;
  projectName: string;
  clientCompany: string;
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  entityType: string;
  entityId: string;
  entityName: string;
  priority: 'urgent' | 'medium' | 'low';
  completed: boolean;
}

export interface Notification {
  id: string;
  type: 'Update' | 'Alert' | 'Reminder' | 'Announcement';
  title: string;
  content: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  senderStatus: 'online' | 'away' | 'dnd' | 'offline';
  preview: string;
  time: string;
  unreadCount: number;
  thread: Array<{
    id: string;
    sender: string;
    content: string;
    time: string;
    isSelf: boolean;
  }>;
}

export interface Settings {
  showNotifications: boolean;
  notifyNewReply: boolean;
  notifyNewNote: boolean;
  notifyNewTicket: boolean;
  notifyNewMessage: boolean;
  notifyDeployment: boolean;
  notifyInvoice: boolean;
  notifyClient: boolean;
  notifySla: boolean;
  language: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  rtlMode: boolean;
  darkMode: 'Dark' | 'Light' | 'System';
  accentColor: string;
}

export type SystemMode = 'production' | 'readonly' | 'maintenance' | 'p0' | 'info';

export interface NexusState {
  user: User;
  acknowledgedPrivacy: boolean;
  activeTicketId: string | null;
  tickets: Ticket[];
  projects: Project[];
  clients: ClientProfile[];
  invoices: Invoice[];
  reminders: Reminder[];
  notifications: Notification[];
  messages: DirectMessage[];
  feedbackList: Array<{ id: string; feature: string; detail: string; date: string }>;
  settings: Settings;

  // System mode
  systemMode: SystemMode;
  writesAllowed: boolean;
  modeMessage: string;
  modeUpdatedBy: string;
  modeUpdatedAt: string | null;

  isAuthenticated: boolean;
  // Actions
  login: (role: User['role']) => void;
  logout: () => void;
  setUserStatus: (status: User['status']) => void;
  acknowledgePrivacy: () => void;
  setActiveTicket: (id: string | null) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addTicketMessage: (id: string, content: string, isInternal: boolean) => void;
  addAnnotation: (id: string, text: string) => void;
  createTicket: (ticket: Partial<Ticket>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addFeedback: (feature: string, detail: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  sendDirectMessage: (senderId: string, content: string) => void;
  addBillingRoutingRule: (clientId: string, name: string, condition: string, destination: string, split: number) => void;
  removeBillingRoutingRule: (clientId: string, ruleId: string) => void;
  submitBugReport: (bug: { severity: string; category: string; description: string }) => void;
  setSystemMode: (mode: SystemMode, writesAllowed: boolean, message: string, updatedBy: string, updatedAt: string | null) => void;
}

export const useNexusStore = create<NexusState>((set) => {
  // Setup 23 PNG files mapping:
  // Avatars: 1.png to 10.png
  // Projects: 11.png to 16.png
  // Attachments: 17.png to 21.png
  // Docs/Verification: 22.png, 23.png
  
  const initialUser: User = {
    id: 'agent_01',
    name: 'Sarah Connor',
    avatar: '5.png',
    role: 'Senior Agent',
    status: 'online',
    team: 'Escalation Tier 2'
  };

  const initialClients: ClientProfile[] = [
    {
      id: 'CL-001',
      name: 'Marie Dubois',
      company: 'PayTech SAS',
      avatar: '1.png',
      status: 'Full access',
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
      creationDate: 'Jan 14, 2021',
      lastLogin: '2026-06-18T10:45:00Z',
      language: 'French',
      additionalLanguages: ['English', 'German'],
      totalRevenue: '€184,500.00',
      avgCsat: 4.8,
      npsScore: 9,
      paymentReliability: '✅ Always on time',
      flags: ['VIP', 'Enterprise', 'NDA Signed', 'Note (2)'],
      childAccounts: [
        { name: 'PayTech Germany GmbH', status: 'VERIFIED', type: 'GmbH', seats: 2, projects: 1, earnings: '€45,000' },
        { name: 'PayTech UK Ltd', status: 'VERIFIED', type: 'Ltd.', seats: 3, projects: 1, earnings: '€32,000' }
      ],
      portalUsers: [
        { name: 'Marie Dubois', role: 'Admin', lastLogin: '2 hours ago', twoFactor: true, permissionLevel: 'Full Access' },
        { name: 'Sophie Martin', role: 'Billing only', lastLogin: '1 day ago', twoFactor: true, permissionLevel: 'Billing' },
        { name: 'Pierre Leveque', role: 'Member', lastLogin: '3 days ago', twoFactor: false, permissionLevel: 'Read/Write' }
      ],
      billingPrefs: {
        contractType: 'Time & Materials',
        billingCycle: 'Monthly',
        paymentTerms: 'Net 30',
        autoInvoice: true,
        currency: 'EUR',
        vatRate: 20,
        withholdingTax: false,
        routingRules: [
          { id: 'rule_1', name: 'EU Subsidiary Split', condition: 'Project contains PayTech DE', destination: 'PayTech Germany GmbH', split: 40 }
        ]
      }
    },
    {
      id: 'CL-002',
      name: 'Liam O\'Connor',
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
      creationDate: 'May 22, 2024',
      lastLogin: '2026-06-18T14:10:00Z',
      language: 'English',
      additionalLanguages: ['Spanish'],
      totalRevenue: '$240,000.00',
      avgCsat: 4.6,
      npsScore: 8,
      paymentReliability: '✅ Always on time',
      flags: ['Enterprise', 'NDA Signed'],
      childAccounts: [],
      portalUsers: [
        { name: 'Liam O\'Connor', role: 'Admin', lastLogin: '10 min ago', twoFactor: true, permissionLevel: 'Full Access' },
        { name: 'Devon Miller', role: 'Member', lastLogin: '2 days ago', twoFactor: true, permissionLevel: 'Read/Write' }
      ],
      billingPrefs: {
        contractType: 'Fixed price',
        billingCycle: 'Milestone-based',
        paymentTerms: 'Net 15',
        autoInvoice: false,
        currency: 'USD',
        vatRate: 0,
        withholdingTax: true,
        routingRules: []
      }
    }
  ];

  const initialProjects: Project[] = [
    {
      id: 'PRJ-101',
      name: 'PayTech Portal',
      code: 'PRJ-PAY01',
      serviceType: 'Fintech',
      status: 'On track',
      thumbnail: '11.png',
      startDate: 'Mar 15, 2026',
      endDate: 'Sep 15, 2026',
      durationWeeks: 26,
      locationType: 'Remote · 4 developers · 2 designers',
      teamSize: '6',
      contractType: 'Time & Materials',
      contractPhase: 'Phase 2 of 4',
      contractValue: '€120,000.00',
      teamLead: 'Hiroshi Tanaka',
      timeline: [
        { phase: 'Discovery & UX Design', duration: '4 weeks', teamSize: 3, status: 'Completed', progress: 100 },
        { phase: 'Frontend Core Integration', duration: '8 weeks', teamSize: 5, status: 'In progress', progress: 65 },
        { phase: 'API Gateway & Security', duration: '8 weeks', teamSize: 4, status: 'Upcoming', progress: 0 },
        { phase: 'Beta QA & Launch', duration: '6 weeks', teamSize: 6, status: 'Upcoming', progress: 0 }
      ],
      milestones: [
        { name: 'Wireframes & Interactive Prototypes', due: 'Apr 10, 2026', status: 'Delivered', signoff: 'Marie Dubois' },
        { name: 'Sprint 1 Web UI Build', due: 'May 20, 2026', status: 'Delivered', signoff: 'Marie Dubois' },
        { name: 'Sprint 2 Payment Engine Hookup', due: 'Jul 05, 2026', status: 'Pending', signoff: 'Pending' }
      ],
      deployments: [
        { env: 'Staging', version: 'v1.2.0-rc3', by: 'Emma Watson', date: 'Jun 14, 2026', status: 'Staging', rollback: false },
        { env: 'Production', version: 'v1.1.0', by: 'Emma Watson', date: 'May 02, 2026', status: 'Live', rollback: true }
      ],
      repos: [
        { name: 'github.com/paytech-labs/portal-fe', branch: 'main', commit: '8f92d41', prs: 2, ci: 'Passing', coverage: 87.4 },
        { name: 'github.com/paytech-labs/core-payment-api', branch: 'main', commit: '3a4f10e', prs: 0, ci: 'Passing', coverage: 94.1 }
      ],
      qaRuns: [
        { suite: 'Frontend E2E Tests', date: 'Jun 17, 2026', passed: 142, failed: 0, coverage: 82.5, reportUrl: '#' },
        { suite: 'API Security Penetration', date: 'May 28, 2026', passed: 45, failed: 2, coverage: 100, reportUrl: '#' }
      ]
    },
    {
      id: 'PRJ-102',
      name: 'EtherDeFi Smart Contract',
      code: 'PRJ-ETH02',
      serviceType: 'Blockchain',
      status: 'At risk',
      thumbnail: '13.png',
      startDate: 'May 01, 2026',
      endDate: 'Aug 15, 2026',
      durationWeeks: 15,
      locationType: 'Remote · 2 developers',
      teamSize: '2',
      contractType: 'Fixed price',
      contractPhase: 'Phase 1 of 2',
      contractValue: '$80,000.00',
      teamLead: 'Alex Rivera',
      timeline: [
        { phase: 'Protocol Architecture Design', duration: '3 weeks', teamSize: 2, status: 'Completed', progress: 100 },
        { phase: 'Smart Contract Coding', duration: '6 weeks', teamSize: 2, status: 'In progress', progress: 40 },
        { phase: 'Auditing & Security Hardening', duration: '6 weeks', teamSize: 3, status: 'Upcoming', progress: 0 }
      ],
      milestones: [
        { name: 'ERC-20 Staking Protocol Draft', due: 'May 20, 2026', status: 'Delivered', signoff: 'Liam O\'Connor' },
        { name: 'Hardhat Local Environment Deployment', due: 'Jun 18, 2026', status: 'At risk', signoff: 'Pending' }
      ],
      deployments: [
        { env: 'Testnet (Sepolia)', version: 'v0.1.0-alpha', by: 'Alex Rivera', date: 'Jun 10, 2026', status: 'Live', rollback: false }
      ],
      repos: [
        { name: 'github.com/defilabs-io/staking-contracts', branch: 'dev', commit: '2e98fa1', prs: 1, ci: 'Failing', coverage: 71.0 }
      ],
      qaRuns: [
        { suite: 'Solidity Compiler Tests', date: 'Jun 15, 2026', passed: 24, failed: 1, coverage: 78.3, reportUrl: '#' }
      ]
    }
  ];

  const initialTickets: Ticket[] = [
    {
      id: 'TCK-9481',
      subject: 'Critical: Production payment gateway failing with 504 Gateway Timeout',
      status: 'Open',
      priority: 'Urgent',
      clientId: 'CL-001',
      clientName: 'Marie Dubois',
      clientCompany: 'PayTech SAS',
      clientAvatar: '1.png',
      clientOutsideHours: true,
      assignedTo: 'Sarah Connor',
      assignedTeam: 'Escalation Tier 2',
      projectId: 'PRJ-101',
      projectName: 'PayTech Portal',
      projectService: 'Fintech',
      projectThumb: '11.png',
      lastMessage: 'We are seeing sporadic 504 Gateway Timeouts on our checkout endpoint (POST /api/v1/charge) in production. This is affecting about 15% of our traffic during peak loads. We need this investigated urgently.',
      lastMessageTime: '10 mins ago',
      createdTime: '2 hours ago',
      messages: [
        {
          id: 'msg_1',
          sender: 'Marie Dubois',
          avatar: '1.png',
          role: 'Client CEO',
          content: 'We are seeing sporadic 504 Gateway Timeouts on our checkout endpoint (POST /api/v1/charge) in production. This is affecting about 15% of our traffic during peak loads. We need this investigated urgently.',
          time: '2 hours ago',
          isInternal: false
        },
        {
          id: 'msg_2',
          sender: 'Sarah Connor',
          avatar: '5.png',
          role: 'Senior Agent',
          content: 'I am assigning this ticket to myself and bringing in the API & Backend Team Lead. We will check the production application logs and proxy configurations immediately.',
          time: '1 hour ago',
          isInternal: false
        },
        {
          id: 'msg_3',
          sender: 'Sarah Connor',
          avatar: '5.png',
          role: 'Senior Agent',
          content: 'Internal Note: I checked the Nginx proxy logs. It seems Nginx is timing out waiting for the upstream Node.js container. CPU utilization is spikes around 95% on backend-01. Likely an un-indexed database query or database lock. Paging Hiroshi.',
          time: '45 mins ago',
          isInternal: true
        }
      ],
      annotations: [
        { id: 'ann_1', agentName: 'Sarah Connor', avatar: '5.png', text: 'Accessed for training purposes. Checked production dashboard settings.', time: '1 hour ago' }
      ]
    },
    {
      id: 'TCK-7294',
      subject: 'Gas optimization review for ERC-20 staking contract',
      status: 'In Progress',
      priority: 'Medium',
      clientId: 'CL-002',
      clientName: 'Liam O\'Connor',
      clientCompany: 'DeFi Labs Ltd',
      clientAvatar: '2.png',
      clientOutsideHours: false,
      assignedTo: 'Alex Rivera',
      assignedTeam: 'Blockchain & Web3 Dev',
      projectId: 'PRJ-102',
      projectName: 'EtherDeFi Smart Contract',
      projectService: 'Blockchain',
      projectThumb: '13.png',
      lastMessage: 'Can we review the gas consumption on the stake() function? It seems to exceed normal levels under high network congestion. Let\'s schedule a code review.',
      lastMessageTime: '3 hours ago',
      createdTime: '1 day ago',
      messages: [
        {
          id: 'msg_4',
          sender: 'Liam O\'Connor',
          avatar: '2.png',
          role: 'Client CEO',
          content: 'Can we review the gas consumption on the stake() function? It seems to exceed normal levels under high network congestion. Let\'s schedule a code review.',
          time: '3 hours ago',
          isInternal: false
        }
      ],
      annotations: []
    }
  ];

  const initialInvoices: Invoice[] = [
    { id: 'INV-2026-004', projectId: 'PRJ-101', projectName: 'PayTech Portal', clientCompany: 'PayTech SAS', amount: '€20,000.00', dueDate: '2026-07-15', status: 'Pending' },
    { id: 'INV-2026-003', projectId: 'PRJ-101', projectName: 'PayTech Portal', clientCompany: 'PayTech SAS', amount: '€35,000.00', dueDate: '2026-06-15', status: 'Paid' },
    { id: 'INV-2026-002', projectId: 'PRJ-102', projectName: 'EtherDeFi Smart Contract', clientCompany: 'DeFi Labs Ltd', amount: '$40,000.00', dueDate: '2026-06-10', status: 'Overdue' },
    { id: 'INV-2026-001', projectId: 'PRJ-101', projectName: 'PayTech Portal', clientCompany: 'PayTech SAS', amount: '€15,000.00', dueDate: '2026-05-15', status: 'Paid' }
  ];

  const initialNotifications: Notification[] = [
    { id: 'not_1', type: 'Alert', title: 'SLA breach warning — Ticket #TCK-9481', content: 'Urgent ticket #TCK-9481 response deadline is in 1 hour.', time: '1 hour ago', read: false },
    { id: 'not_2', type: 'Update', title: 'Deployment completed for PayTech Portal', content: 'v1.2.0-rc3 deployed successfully to Staging by Emma Watson.', time: '4 hours ago', read: true },
    { id: 'not_3', type: 'Reminder', title: 'Sprint review meeting in 30 minutes', content: 'PayTech Portal Sprint review with client CEO Marie Dubois.', time: '30 mins ago', read: false },
    { id: 'not_4', type: 'Update', title: 'Invoice #INV-2026-002 is 7 days overdue', content: '$40,000.00 overdue for DeFi Labs Ltd project: EtherDeFi Smart Contract.', time: '3 days ago', read: true }
  ];

  const initialMessages: DirectMessage[] = [
    {
      id: 'dm_1',
      senderId: 'hiroshi_tanaka',
      senderName: 'Hiroshi Tanaka',
      senderAvatar: '3.png',
      senderRole: 'Technical Lead',
      senderStatus: 'online',
      preview: 'I am checking the Node CPU spike on TCK-9481 now.',
      time: '15 mins ago',
      unreadCount: 1,
      thread: [
        { id: 't_1', sender: 'Sarah Connor', content: 'Hey Hiroshi, can you look at PayTech? CPU is hitting 95% on backend-01 and throwing 504 timeouts.', time: '30 mins ago', isSelf: true },
        { id: 't_2', sender: 'Hiroshi Tanaka', content: 'Sure thing Sarah. I am checking the Node CPU spike on TCK-9481 now. Will look at the postgres connection pool settings as well.', time: '15 mins ago', isSelf: false }
      ]
    },
    {
      id: 'dm_2',
      senderId: 'sophie_martin',
      senderName: 'Sophie Martin',
      senderAvatar: '4.png',
      senderRole: 'Finance Officer',
      senderStatus: 'away',
      preview: 'I sent the payment reminder to PayTech.',
      time: 'Yesterday',
      unreadCount: 0,
      thread: [
        { id: 't_3', sender: 'Sophie Martin', content: 'I sent the payment reminder to PayTech. Let me know if you want me to pause deployment support.', time: 'Yesterday', isSelf: false }
      ]
    }
  ];

  const initialReminders: Reminder[] = [
    { id: 'rem_1', title: 'Verify Nginx log settings', dueDate: 'Tomorrow at 9:00 AM', entityType: 'ticket', entityId: 'TCK-9481', entityName: 'TCK-9481', priority: 'urgent', completed: false },
    { id: 'rem_2', title: 'Prepare invoice summaries for Q2', dueDate: 'Jun 22, 2026', entityType: 'invoice', entityId: 'INV-2026-002', entityName: 'INV-2026-002', priority: 'medium', completed: false }
  ];

  return {
    user: initialUser,
    isAuthenticated: false,
    acknowledgedPrivacy: false,
    activeTicketId: 'TCK-9481',
    // System mode defaults — overwritten immediately by useSystemMode hook on app boot
    systemMode: 'production',
    writesAllowed: true,
    modeMessage: '🟢 Live production environment — all operations active',
    modeUpdatedBy: 'system',
    modeUpdatedAt: null,
    tickets: initialTickets,
    projects: initialProjects,
    clients: initialClients,
    invoices: initialInvoices,
    reminders: initialReminders,
    notifications: initialNotifications,
    messages: initialMessages,
    feedbackList: [],
    settings: {
      showNotifications: true,
      notifyNewReply: true,
      notifyNewNote: true,
      notifyNewTicket: true,
      notifyNewMessage: true,
      notifyDeployment: true,
      notifyInvoice: true,
      notifyClient: true,
      notifySla: true,
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/Paris',
      rtlMode: false,
      darkMode: 'Dark',
      accentColor: '#6366F1'
    },

    // Actions
    login: (role) => set(() => {
      const defaultUser = {
        Agent: { name: 'John Doe', avatar: '6.png', team: 'Support Team A' },
        'Senior Agent': { name: 'Sarah Connor', avatar: '5.png', team: 'Escalation Tier 2' },
        'Project Manager': { name: 'Marcus Aurelius', avatar: '7.png', team: 'PMO Group' },
        'Technical Lead': { name: 'Hiroshi Tanaka', avatar: '3.png', team: 'API Engineering' },
        'Finance Officer': { name: 'Sophie Martin', avatar: '4.png', team: 'Finance Department' },
        'Administrator': { name: 'Ellen Ripley', avatar: '8.png', team: 'IT Ops' },
        'Trainee': { name: 'Luke Skywalker', avatar: '9.png', team: 'Training Cohort' }
      }[role];

      return {
        isAuthenticated: true,
        user: {
          id: `usr_${role.toLowerCase().replace(' ', '_')}`,
          name: defaultUser.name,
          avatar: defaultUser.avatar,
          role,
          status: 'online',
          team: defaultUser.team
        },
        acknowledgedPrivacy: false
      };
    }),
    
    logout: () => set({ isAuthenticated: false, user: { id: 'guest', name: 'Guest User', avatar: '10.png', role: 'Trainee', status: 'offline', team: 'Guest' }, acknowledgedPrivacy: false }),
    
    setUserStatus: (status) => set((state) => ({ user: { ...state.user, status } })),
    
    acknowledgePrivacy: () => set({ acknowledgedPrivacy: true }),
    
    setActiveTicket: (id) => set({ activeTicketId: id }),
    
    updateTicketStatus: (id, status) => set((state) => {
      const tickets = state.tickets.map(t => t.id === id ? { ...t, status } : t);
      
      // Add activity log event
      const updatedTicket = tickets.find(t => t.id === id);
      if (updatedTicket) {
        // Trigger alert of status change
        const eventMsg = `Case status updated to ${status} by ${state.user.name}`;
        console.log(eventMsg);
      }

      return { tickets };
    }),

    addTicketMessage: (id, content, isInternal) => set((state) => {
      const tickets = state.tickets.map(t => {
        if (t.id === id) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            sender: state.user.name,
            avatar: state.user.avatar,
            role: state.user.role,
            content,
            time: 'Just now',
            isInternal
          };
          return {
            ...t,
            lastMessage: content,
            lastMessageTime: 'Just now',
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      });
      return { tickets };
    }),

    addAnnotation: (id, text) => set((state) => {
      const tickets = state.tickets.map(t => {
        if (t.id === id) {
          const newAnn = {
            id: `ann_${Date.now()}`,
            agentName: state.user.name,
            avatar: state.user.avatar,
            text,
            time: 'Just now'
          };
          return {
            ...t,
            annotations: [...t.annotations, newAnn]
          };
        }
        return t;
      });
      return { tickets };
    }),

    createTicket: (ticketData) => set((state) => {
      const id = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: Ticket = {
        id,
        subject: ticketData.subject || 'Generic Technical Inquiry',
        status: 'Open',
        priority: ticketData.priority || 'Medium',
        clientId: ticketData.clientId || 'CL-001',
        clientName: ticketData.clientName || 'Marie Dubois',
        clientCompany: ticketData.clientCompany || 'PayTech SAS',
        clientAvatar: ticketData.clientAvatar || '1.png',
        clientOutsideHours: ticketData.clientOutsideHours || false,
        assignedTo: state.user.name,
        assignedTeam: state.user.team,
        projectId: ticketData.projectId || 'PRJ-101',
        projectName: ticketData.projectName || 'PayTech Portal',
        projectService: ticketData.projectService || 'Fintech',
        projectThumb: ticketData.projectThumb || '11.png',
        lastMessage: ticketData.lastMessage || 'Ticket initiated.',
        lastMessageTime: 'Just now',
        createdTime: 'Just now',
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: ticketData.clientName || 'Marie Dubois',
            avatar: ticketData.clientAvatar || '1.png',
            role: 'Client Contact',
            content: ticketData.lastMessage || 'Ticket initiated.',
            time: 'Just now',
            isInternal: false
          }
        ],
        annotations: [],
        ...ticketData
      };

      // Create notification
      const newNotif: Notification = {
        id: `not_${Date.now()}`,
        type: 'Update',
        title: `New ticket assigned: #${id}`,
        content: `Subject: ${newTicket.subject}`,
        time: 'Just now',
        read: false
      };

      return {
        tickets: [newTicket, ...state.tickets],
        notifications: [newNotif, ...state.notifications]
      };
    }),

    markNotificationRead: (id) => set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),

    markAllNotificationsRead: () => set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    addReminder: (reminder) => set((state) => {
      const newReminder: Reminder = {
        id: `rem_${Date.now()}`,
        completed: false,
        ...reminder
      };
      return { reminders: [newReminder, ...state.reminders] };
    }),

    toggleReminder: (id) => set((state) => ({
      reminders: state.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    })),

    deleteReminder: (id) => set((state) => ({
      reminders: state.reminders.filter(r => r.id !== id)
    })),

    addFeedback: (feature, detail) => set((state) => ({
      feedbackList: [{ id: `fb_${Date.now()}`, feature, detail, date: 'Just now' }, ...state.feedbackList]
    })),

    updateSettings: (newSettings) => set((state) => {
      const settings = { ...state.settings, ...newSettings };
      
      // Update HTML root dark class or style elements
      if (settings.darkMode === 'Dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.darkMode === 'Light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      // Accent color CSS variable injection
      if (newSettings.accentColor) {
        document.documentElement.style.setProperty('--accent-primary', newSettings.accentColor);
      }

      return { settings };
    }),

    sendDirectMessage: (senderId, content) => set((state) => {
      const messages = state.messages.map(m => {
        if (m.senderId === senderId) {
          const newMsg = {
            id: `t_${Date.now()}`,
            sender: state.user.name,
            content,
            time: 'Just now',
            isSelf: true
          };
          return {
            ...m,
            preview: content,
            time: 'Just now',
            thread: [...m.thread, newMsg]
          };
        }
        return m;
      });
      return { messages };
    }),

    addBillingRoutingRule: (clientId, name, condition, destination, split) => set((state) => {
      const clients = state.clients.map(c => {
        if (c.id === clientId) {
          const newRule = { id: `rule_${Date.now()}`, name, condition, destination, split };
          return {
            ...c,
            billingPrefs: {
              ...c.billingPrefs,
              routingRules: [...c.billingPrefs.routingRules, newRule]
            }
          };
        }
        return c;
      });
      return { clients };
    }),

    removeBillingRoutingRule: (clientId, ruleId) => set((state) => {
      const clients = state.clients.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            billingPrefs: {
              ...c.billingPrefs,
              routingRules: c.billingPrefs.routingRules.filter(r => r.id !== ruleId)
            }
          };
        }
        return c;
      });
      return { clients };
    }),

    submitBugReport: (bug) => set((state) => {
      // Create notification from system
      const newNotif: Notification = {
        id: `not_${Date.now()}`,
        type: 'Alert',
        title: `Platform Bug Submitted: [${bug.severity}] ${bug.category}`,
        content: bug.description.substring(0, 80) + '...',
        time: 'Just now',
        read: false
      };
      
      // Auto response alert in console/network log
      console.log('Nexus Bug Registered:', bug);
      
      return {
        notifications: [newNotif, ...state.notifications]
      };
    }),

    setSystemMode: (mode, writesAllowed, message, updatedBy, updatedAt) =>
      set({ systemMode: mode, writesAllowed, modeMessage: message, modeUpdatedBy: updatedBy, modeUpdatedAt: updatedAt }),
  };
});
