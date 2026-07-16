import React from 'react';
import { DashboardProvider } from '../dashboard/dashboardContext';
import { IncidentProvider } from '../incidents/incidentContext';
import { VolunteerProvider } from '../volunteers/volunteerContext';
import { CrowdProvider } from '../crowd/crowdContext';
import { CommunicationProvider } from '../communications/communicationContext';
import { AccessibilityProvider } from '../accessibility/accessibilityContext';
import { ReportProvider } from '../reports/reportContext';
import { SettingsProvider } from '../settings/settingsContext';
import { IncidentAIProvider } from '../incidentAI/incidentAIContext';
import { VolunteerAIProvider } from '../volunteerAI/volunteerAIContext';
import { CrowdAIProvider } from '../crowdAI/crowdAIContext';
import { TranslationAIProvider } from '../translationAI/translationAIContext';
import { AccessibilityAIProvider } from '../accessibilityAI/accessibilityAIContext';
import { DecisionSupportAIProvider } from '../decisionSupportAI/decisionSupportAIContext';

/**
 * Root Composed Application Provider
 * Stacks all domain modules contexts to prevent excessive indentation in App.tsx.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <DashboardProvider>
        <DecisionSupportAIProvider>
          <IncidentProvider>
            <IncidentAIProvider>
              <VolunteerProvider>
                <VolunteerAIProvider>
                  <CrowdProvider>
                    <CrowdAIProvider>
                      <CommunicationProvider>
                        <TranslationAIProvider>
                          <AccessibilityProvider>
                            <AccessibilityAIProvider>
                              <ReportProvider>
                                {children}
                              </ReportProvider>
                            </AccessibilityAIProvider>
                          </AccessibilityProvider>
                        </TranslationAIProvider>
                      </CommunicationProvider>
                    </CrowdAIProvider>
                  </CrowdProvider>
                </VolunteerAIProvider>
              </VolunteerProvider>
            </IncidentAIProvider>
          </IncidentProvider>
        </DecisionSupportAIProvider>
      </DashboardProvider>
    </SettingsProvider>
  );
};
