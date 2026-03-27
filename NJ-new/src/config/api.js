// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Events (PUBLIC - no auth required)
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_BY_ID: (id) => `${API_BASE_URL}/events/${id}`,
  EVENT_REGISTER: `${API_BASE_URL}/eventsRegistration/register`,

  // Sermons (PUBLIC - no auth required)
  SERMONS: `${API_BASE_URL}/sermons`,
  SERMON_BY_ID: (id) => `${API_BASE_URL}/sermons/${id}`,

  // Members (PROTECTED - requires auth, use with caution)
  MEMBERS: `${API_BASE_URL}/members`,
  MEMBER_BY_ID: (id) => `${API_BASE_URL}/members/${id}`,

  // Newsletter (PUBLIC POST - no auth required for subscribe)
  NEWSLETTER_SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,

  // Get in Touch / Contact (PUBLIC POST - no auth required)
  GET_IN_TOUCH: `${API_BASE_URL}/getInTouch`,
}

export default API_BASE_URL;
