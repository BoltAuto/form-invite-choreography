import { toast } from 'sonner';

const API_BASE_URL = 'https://n8n-main-instance-production-1345.up.railway.app/webhook';

interface PageLoadResponse {
  name?: string;
  availableUsers?: number;
  activeUsers?: number;
  emails?: string;
  paymentemail?: string;
  submitted?: boolean;
}

interface KeyVerificationResponse {
  openRouterPass: 'pass' | 'fail';
  fluxPass: 'pass' | 'fail';
}

interface ApiKeySubmissionPayload {
  answers: {
    company_name: string;
    firstName: string;
    openRouterApiKey: string;
    fluxApiKey: string;
    apikeyspassed: boolean;
    slackEmailIsFine: boolean;
    formToken: string;
    prefered_email_addressSlack: string;
  }
}

interface User {
  name: string;
  email: string;
}

interface UserSubmissionPayload {
  formToken: string;
  users: User[];
}

export const fetchFormData = async (formToken: string): Promise<PageLoadResponse> => {
  try {
    console.log('Fetching form data with token:', formToken);
    const response = await fetch(`${API_BASE_URL}/pageload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ formToken }),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching form data:', error);
    toast.error('Failed to load form data. Please refresh and try again.');
    return {};
  }
};

export const verifyApiKeys = async (openRouterApiKey: string, fluxApiKey: string): Promise<KeyVerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/keyveriffy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        openRouterApiKey,
        fluxApiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying API keys:', error);
    toast.error('Failed to verify API keys. Please try again.');
    return { openRouterPass: 'fail', fluxPass: 'fail' };
  }
};

export const submitApiKeyForm = async (payload: ApiKeySubmissionPayload): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitanswers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    await response.json();
    
    if (payload.answers.apikeyspassed) {
      toast.success('Form submitted successfully!');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Failed to submit form. Please try again.');
  }
};

export const submitUserInvitations = async (payload: UserSubmissionPayload): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitusers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    await response.json();
    toast.success('Users invited successfully!');
  } catch (error) {
    console.error('Error inviting users:', error);
    toast.error('Failed to invite users. Please try again.');
  }
};
