const { fetchSinglePlayer, addNewPlayer } = require('./script');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('Puppy Bowl API Functions', () => {

    beforeEach(() => {
        fetch.resetMocks();
    });

    describe('fetchSinglePlayer', () => {
        test('should fetch player data successfully', async () => {
            const mockPlayer = { id: 1, name: "Buddy", breed: "Golden Retriever" };
            
            fetch.mockResponseOnce(JSON.stringify({ data: { player: mockPlayer } }));
            
            const result = await fetchSinglePlayer(1);

            expect(fetch).toHaveBeenCalledWith('https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-ET-WEB-PT/players/1');
            expect(result).toEqual(mockPlayer);
        });

        test('should handle fetch errors gracefully', async () => {
            fetch.mockReject(() => Promise.reject('API failure'));

            await expect(fetchSinglePlayer(99)).rejects.toThrow('API failure');
        });
    });

    describe('addNewPlayer', () => {
        test('should add a new puppy successfully', async () => {
            const newPuppy = { name: "Charlie", breed: "Labrador", imageUrl: "https://example.com/charlie.jpg" };

            fetch.mockResponseOnce(JSON.stringify({ data: { player: newPuppy } }));

            const result = await addNewPlayer(newPuppy);

            expect(fetch).toHaveBeenCalledWith('https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-ET-WEB-PT/players', 
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(newPuppy),
                })
            );

            expect(result).toEqual(newPuppy);
        });

        test('should handle errors when adding a new player', async () => {
            fetch.mockReject(() => Promise.reject('API failure'));

            await expect(addNewPlayer({ name: "Fail", breed: "Unknown" })).rejects.toThrow('API failure');
        });
    });
});
