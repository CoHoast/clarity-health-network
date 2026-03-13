import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    const { message, conversationId } = await req.json();

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.pulseConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
      });
    }

    if (!conversation) {
      conversation = await prisma.pulseConversation.create({
        data: {
          userId: payload.id,
          userType: payload.role,
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.pulseMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      }
    });

    // Generate response based on context
    let response = '';
    const lowerMessage = message.toLowerCase();

    // Role-specific responses
    if (payload.role === 'member') {
      if (lowerMessage.includes('deductible') || lowerMessage.includes('benefits')) {
        response = "I can help you understand your benefits! Based on your plan, your individual deductible is $500 and you've used $150 so far this year. Your out-of-pocket maximum is $3,000. Would you like me to break down your remaining benefits?";
      } else if (lowerMessage.includes('claim') || lowerMessage.includes('status')) {
        response = "I can check your claim status. Your most recent claim (CLM-2026-00001) from March 1st has been paid. The total billed was $150.00, your plan paid $76.00, and your responsibility is $19.00. Would you like to see more details or your EOB?";
      } else if (lowerMessage.includes('doctor') || lowerMessage.includes('provider') || lowerMessage.includes('find')) {
        response = "I can help you find an in-network provider! What type of doctor are you looking for? I can search by specialty, location, or name. Some popular specialties in your area include Family Medicine, Cardiology, and Orthopedics.";
      } else if (lowerMessage.includes('id card')) {
        response = "Your digital ID card is available in your Member Portal under 'ID Card'. You can view it on your phone, download a PDF, or request a physical card to be mailed. Would you like me to show you how to access it?";
      } else {
        response = "I'm Pulse, your AI health assistant! I can help you with:\n\n• Checking your benefits and deductible\n• Finding in-network providers\n• Understanding your claims and EOBs\n• Accessing your ID card\n• Estimating costs for procedures\n\nWhat would you like help with?";
      }
    } else if (payload.role === 'provider') {
      if (lowerMessage.includes('eligibility') || lowerMessage.includes('verify')) {
        response = "I can help you verify patient eligibility! To check eligibility, you'll need the member's ID number and date of birth. Would you like me to guide you through the eligibility check process, or do you have a specific patient you'd like to verify?";
      } else if (lowerMessage.includes('claim') || lowerMessage.includes('payment')) {
        response = "Looking at your recent claims: You have 15 claims pending review and 42 claims paid this month totaling $12,450. Your average claim turnaround is 3.2 days. Would you like to see details on specific claims or your payment history?";
      } else if (lowerMessage.includes('credential')) {
        response = "Your credentialing status is current. Your medical license expires on 12/31/2026 and your malpractice insurance is valid. I'll remind you 90 days before any credentials need renewal. Is there anything specific about credentialing you need help with?";
      } else {
        response = "I'm Pulse, your provider support assistant! I can help with:\n\n• Verifying patient eligibility\n• Checking claim status and payments\n• Understanding fee schedules\n• Credentialing questions\n• Contract inquiries\n\nHow can I assist you today?";
      }
    } else if (payload.role === 'employer') {
      if (lowerMessage.includes('employee') || lowerMessage.includes('roster')) {
        response = "Your roster currently shows 45 active employees. Would you like to add a new employee, update existing information, or review your enrollment status?";
      } else if (lowerMessage.includes('bill') || lowerMessage.includes('invoice') || lowerMessage.includes('payment')) {
        response = "You have 1 pending invoice for $52,500 due on March 15th. Your year-to-date premiums paid total $157,500. Would you like to view invoice details or make a payment?";
      } else if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
        response = "I can generate reports on claims utilization, cost trends, and employee enrollment. Your top expense categories this year are: Primary Care (35%), Specialist Visits (28%), and Prescriptions (22%). Would you like a detailed report?";
      } else {
        response = "I'm Pulse, your benefits administration assistant! I can help with:\n\n• Managing your employee roster\n• Viewing invoices and payments\n• Generating utilization reports\n• Enrollment period management\n• Stop-loss tracking\n\nWhat do you need help with?";
      }
    } else if (payload.role === 'admin') {
      if (lowerMessage.includes('claim') || lowerMessage.includes('queue')) {
        response = "Current claims queue: 156 claims pending review, 23 flagged for potential fraud, 12 requiring additional documentation. Average processing time is 2.3 days. Would you like me to prioritize any specific claims or show you the fraud alerts?";
      } else if (lowerMessage.includes('fraud') || lowerMessage.includes('alert')) {
        response = "There are 5 open fraud alerts: 2 critical (potential duplicate billing), 2 high (unusual billing patterns), and 1 medium (out-of-network emergency). Would you like to review these cases?";
      } else if (lowerMessage.includes('provider') || lowerMessage.includes('credential')) {
        response = "Provider network status: 250 total providers, 235 contracted, 3 pending credentialing approval. 5 providers have credentials expiring in the next 90 days. Need me to show you the credentialing queue?";
      } else {
        response = "I'm Pulse, your administrative AI assistant! I can help with:\n\n• Claims queue management\n• Fraud detection alerts\n• Provider network oversight\n• Member eligibility issues\n• System analytics and reporting\n\nWhat would you like to work on?";
      }
    } else {
      response = "Hello! I'm Pulse, your AI assistant. How can I help you today?";
    }

    // Save assistant response
    await prisma.pulseMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: response,
      }
    });

    return NextResponse.json({
      response,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Pulse chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
