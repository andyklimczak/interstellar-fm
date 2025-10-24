import { act, fireEvent, waitFor } from '@testing-library/react-native';

import { SearchStationsTab } from '@/components/radio/SearchStationsTab';
import { renderWithRadioContext, createStation } from '@/test/test-utils';
import { fetchTopStations, searchStations } from '@/lib/radio-browser';

jest.mock('@/lib/radio-browser', () => ({
  fetchTopStations: jest.fn(),
  searchStations: jest.fn(),
}));

const mockedFetchTopStations = fetchTopStations as jest.MockedFunction<typeof fetchTopStations>;
const mockedSearchStations = searchStations as jest.MockedFunction<typeof searchStations>;

describe('SearchStationsTab', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('shows popular stations when hydrated', async () => {
    const topStations = [createStation({ stationuuid: 'featured', name: 'Featured Radio' })];
    mockedFetchTopStations.mockResolvedValue(topStations);

    const { getByText } = renderWithRadioContext(<SearchStationsTab />);

    await waitFor(() => expect(mockedFetchTopStations).toHaveBeenCalled());
    await waitFor(() => expect(getByText('Popular right now')).toBeOnTheScreen());
    expect(getByText('Featured Radio')).toBeOnTheScreen();
  });

  it('searches when user enters a query', async () => {
    const results = [createStation({ stationuuid: 'jazz', name: 'Jazz FM' })];
    mockedFetchTopStations.mockResolvedValue([]);
    mockedSearchStations.mockResolvedValue(results);

    const { getByPlaceholderText, getByText } = renderWithRadioContext(<SearchStationsTab />);

    const input = getByPlaceholderText('Search radio stations');
    fireEvent.changeText(input, 'Jazz');

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() =>
      expect(mockedSearchStations).toHaveBeenCalledWith('Jazz', {
        order: 'name',
      }),
    );

    await waitFor(() => expect(getByText('Jazz FM')).toBeOnTheScreen());
  });
});
