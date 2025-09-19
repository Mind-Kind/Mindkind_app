// Mock MoodEntry entity for development
class MoodEntry {
  constructor(data = {}) {
    this.id = data.id || `mood-${Date.now()}`;
    this.mood_emoji = data.mood_emoji || '😊';
    this.mood_name = data.mood_name || 'joyful';
    this.intensity = data.intensity || 3;
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.created_by = data.created_by || 'user@mindkind.com';
    this.created_date = data.created_date || new Date().toISOString();
  }

  static async create(data) {
    const entry = new MoodEntry(data);
    // In real app, save to database
    console.log('Creating mood entry:', entry);
    return entry;
  }

  static async get(id) {
    // Mock implementation
    return new MoodEntry({ id });
  }

  static async update(id, data) {
    // Mock implementation
    console.log('Updating mood entry:', id, data);
    return new MoodEntry({ id, ...data });
  }

  static async filter(filters = {}, sortBy = null, limit = null) {
    // Mock implementation - return sample data
    const sampleEntries = [
      new MoodEntry({
        id: 'mood-1',
        mood_emoji: '😊',
        mood_name: 'joyful',
        intensity: 4,
        tags: ['work', 'family'],
        notes: 'Had a great day!',
        date: new Date().toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      }),
      new MoodEntry({
        id: 'mood-2',
        mood_emoji: '😌',
        mood_name: 'calm',
        intensity: 3,
        tags: ['meditation'],
        notes: 'Feeling peaceful after meditation',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      })
    ];

    // Apply filters
    let filtered = sampleEntries;
    if (filters.date) {
      filtered = filtered.filter(entry => entry.date === filters.date);
    }
    if (filters.created_by) {
      filtered = filtered.filter(entry => entry.created_by === filters.created_by);
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }
}

export default MoodEntry;
