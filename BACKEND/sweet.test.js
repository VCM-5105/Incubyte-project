const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
 
// Mock Database Connection
// Co-authored-by: AI Assistant <ai@example.com> (Implemented Jest mock pattern)
jest.mock('../config/db', () => ({
    execute: jest.fn(),
    getConnection: jest.fn(),
}));
 
describe('Sweet API Endpoints', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
 
    test('GET /api/sweets should return list of sweets', async () => {
        const mockSweets = [{ id: 1, name: 'Macaron', stock: 10 }];
        pool.execute.mockResolvedValue([mockSweets]);
 
        const res = await request(app).get('/api/sweets');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockSweets);
        expect(pool.execute).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM sweets'), expect.any(Array));
    });
 
    test('POST /api/sweets/1/purchase should decrease stock', async () => {
        // Mocking Transaction Flow
        const mockConnection = {
            beginTransaction: jest.fn(),
            execute: jest.fn()
                .mockResolvedValueOnce([[{ stock: 5, name: 'Macaron' }]]) // SELECT
                .mockResolvedValueOnce([{ affectedRows: 1 }]), // UPDATE
            commit: jest.fn(),
            release: jest.fn(),
            rollback: jest.fn()
        };
        
        pool.getConnection.mockResolvedValue(mockConnection);
 
        const res = await request(app)
            .post('/api/sweets/1/purchase')
            .set('Authorization', 'Bearer valid_token'); // Assuming auth middleware mock
 
        expect(res.statusCode).toEqual(200);
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(res.body.message).toContain('Purchased');
    });
 
    test('Purchase should fail if out of stock', async () => {
        const mockConnection = {
            beginTransaction: jest.fn(),
            execute: jest.fn().mockResolvedValueOnce([[{ stock: 0, name: 'Macaron' }]]), // SELECT -> 0 stock
            commit: jest.fn(),
            release: jest.fn(),
            rollback: jest.fn()
        };
        pool.getConnection.mockResolvedValue(mockConnection);
 
        const res = await request(app).post('/api/sweets/1/purchase');
 
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Out of stock');
        expect(mockConnection.rollback).toHaveBeenCalled();
    });
});