// Mock MeditationSession entity for development
class MeditationSession {
  constructor(data = {}) {
    this.id = data.id || `meditation-${Date.now()}`;
    this.session_type = data.session_type || 'mindfulness';
    this.duration_minutes = data.duration_minutes || 10;
    this.completed = data.completed !== undefined ? data.completed : false;
    this.mood_before = data.mood_before || '😌';
    this.mood_after = data.mood_after || '';
    this.notes = data.notes || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.created_by = data.created_by || 'user@mindkind.com';
    this.created_date = data.created_date || new Date().toISOString();
  }

  static async create(data) {
    const session = new MeditationSession(data);
    // In real app, save to database
    console.log('Creating meditation session:', session);
    return session;
  }

  static async get(id) {
    // Mock implementation
    return new MeditationSession({ id });
  }

  static async update(id, data) {
    // Mock implementation
    console.log('Updating meditation session:', id, data);
    return new MeditationSession({ id, ...data });
  }

  static async filter(filters = {}, sortBy = null, limit = null) {
    // Mock implementation - return sample data
    const sampleSessions = [
      new MeditationSession({
        id: 'meditation-1',
        session_type: 'breathing',
        duration_minutes: 5,
        completed: true,
        mood_before: '😰',
        mood_after: '😌',
        date: new Date().toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      }),
      new MeditationSession({
        id: 'meditation-2',
        session_type: 'mindfulness',
        duration_minutes: 15,
        completed: true,
        mood_before: '😊',
        mood_after: '☮️',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      })
    ];

    // Apply filters
    let filtered = sampleSessions;
    if (filters.created_by) {
      filtered = filtered.filter(session => session.created_by === filters.created_by);
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }
}

export default MeditationSession;
