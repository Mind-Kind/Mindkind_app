// Mock Challenge entity for development
class Challenge {
  constructor(data = {}) {
    this.id = data.id || `challenge-${Date.now()}`;
    this.name = data.name || '';
    this.description = data.description || '';
    this.duration_days = data.duration_days || 7;
    this.category = data.category || 'self-love';
    this.challenge_template_id = data.challenge_template_id || '';
    this.image_url = data.image_url || '';
    this.current_day = data.current_day || 1;
    this.completed_days = data.completed_days || [];
    this.started_date = data.started_date || new Date().toISOString().split('T')[0];
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.is_completed = data.is_completed !== undefined ? data.is_completed : false;
    this.created_by = data.created_by || 'user@mindkind.com';
    this.created_date = data.created_date || new Date().toISOString();
  }

  static async create(data) {
    const challenge = new Challenge(data);
    // In real app, save to database
    console.log('Creating challenge:', challenge);
    return challenge;
  }

  static async get(id) {
    // Mock implementation - return sample challenge
    return new Challenge({
      id,
      name: '7-Day Self-Love Journey',
      description: 'Embark on a 7-day journey to cultivate self-compassion',
      duration_days: 7,
      category: 'self-love',
      challenge_template_id: 'self-love-7',
      image_url: 'https://images.unsplash.com/photo-1599602148287-742a53805434?w=800&q=80',
      current_day: 3,
      completed_days: [1, 2],
      started_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      is_active: true,
      is_completed: false,
      created_by: 'user@mindkind.com'
    });
  }

  static async update(id, data) {
    // Mock implementation
    console.log('Updating challenge:', id, data);
    return new Challenge({ id, ...data });
  }

  static async filter(filters = {}, sortBy = null, limit = null) {
    // Mock implementation - return sample data
    const sampleChallenges = [
      new Challenge({
        id: 'challenge-1',
        name: '7-Day Self-Love Journey',
        description: 'Embark on a 7-day journey to cultivate self-compassion',
        duration_days: 7,
        category: 'self-love',
        challenge_template_id: 'self-love-7',
        current_day: 3,
        completed_days: [1, 2],
        is_active: true,
        is_completed: false,
        created_by: 'user@mindkind.com'
      })
    ];

    // Apply filters
    let filtered = sampleChallenges;
    if (filters.created_by) {
      filtered = filtered.filter(challenge => challenge.created_by === filters.created_by);
    }
    if (filters.is_active !== undefined) {
      filtered = filtered.filter(challenge => challenge.is_active === filters.is_active);
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }
}

export default Challenge;
