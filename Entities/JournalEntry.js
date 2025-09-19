// Mock JournalEntry entity for development
class JournalEntry {
  constructor(data = {}) {
    this.id = data.id || `journal-${Date.now()}`;
    this.title = data.title || 'Untitled Entry';
    this.content = data.content || '';
    this.prompt = data.prompt || '';
    this.mood_before = data.mood_before || '';
    this.mood_after = data.mood_after || '';
    this.tags = data.tags || [];
    this.is_private = data.is_private !== undefined ? data.is_private : true;
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.created_by = data.created_by || 'user@mindkind.com';
    this.created_date = data.created_date || new Date().toISOString();
  }

  static async create(data) {
    const entry = new JournalEntry(data);
    // In real app, save to database
    console.log('Creating journal entry:', entry);
    return entry;
  }

  static async get(id) {
    // Mock implementation
    return new JournalEntry({ id });
  }

  static async update(id, data) {
    // Mock implementation
    console.log('Updating journal entry:', id, data);
    return new JournalEntry({ id, ...data });
  }

  static async filter(filters = {}, sortBy = null, limit = null) {
    // Mock implementation - return sample data
    const sampleEntries = [
      new JournalEntry({
        id: 'journal-1',
        title: 'A Beautiful Day',
        content: 'Today was amazing! I felt so grateful for all the little moments that brought me joy.',
        prompt: 'What made you smile today?',
        mood_before: '😊',
        mood_after: '🥰',
        tags: ['gratitude', 'joy'],
        date: new Date().toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      }),
      new JournalEntry({
        id: 'journal-2',
        title: 'Reflections on Growth',
        content: 'I realized today how much I\'ve grown in the past year. The challenges I faced made me stronger.',
        prompt: 'How did you grow as a person today?',
        mood_before: '🤔',
        mood_after: '✨',
        tags: ['growth', 'reflection'],
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        created_by: 'user@mindkind.com'
      })
    ];

    // Apply filters
    let filtered = sampleEntries;
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

export default JournalEntry;
