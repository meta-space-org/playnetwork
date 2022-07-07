class MockLevelProvider {
    mockData = new Map();

    save(id, data) {
        this.mockData.set(id, data);
    }

    load(id) {
        return this.mockData.get(id);
    }

    has(id) {
        return this.mockData.has(id);
    }
}

export default MockLevelProvider;
