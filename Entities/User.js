// Mock User entity for development
class User {
  constructor(data = {}) {
    this.id = data.id || 'user-1';
    this.email = data.email || 'user@mindkind.com';
    this.preferred_name = data.preferred_name || 'Beautiful Soul';
    this.mood_streak = data.mood_streak || 0;
    this.journal_streak = data.journal_streak || 0;
    this.meditation_minutes = data.meditation_minutes || 0;
    this.current_challenges = data.current_challenges || [];
    this.created_date = data.created_date || new Date().toISOString();
  }

  static async me() {
    // Mock user data - in real app, this would fetch from API
    return new User({
      id: 'user-1',
      email: 'user@mindkind.com',
      preferred_name: 'Beautiful Soul',
      mood_streak: 5,
      journal_streak: 3,
      meditation_minutes: 45,
      current_challenges: ['self-love-7', 'mindfulness-7']
    });
  }

  static async create(data) {
    const user = new User(data);
    // In real app, save to database
    console.log('Creating user:', user);
    return user;
  }

  static async get(id) {
    // Mock implementation
    return new User({ id });
  }

  static async update(id, data) {
    // Mock implementation
    console.log('Updating user:', id, data);
    return new User({ id, ...data });
  }

  static async updateMyUserData(data) {
    // Mock implementation
    console.log('Updating current user data:', data);
    return new User(data);
  }

  static async filter(filters = {}, sortBy = null, limit = null) {
    // Mock implementation - return empty array for now
    return [];
  }
}

export default User;
