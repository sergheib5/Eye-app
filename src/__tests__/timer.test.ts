import { startTimer, stopTimer } from '../timer';

jest.useFakeTimers();

describe('Interval Timer', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('should call the callback at the specified interval', () => {
    const callback = jest.fn();
    const intervalMinutes = 20; // 20 minutes
    const intervalMs = intervalMinutes * 60 * 1000;

    startTimer(intervalMinutes, callback);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), intervalMs);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(intervalMs);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(intervalMs);
    expect(callback).toHaveBeenCalledTimes(2);
    
    stopTimer();
  });

  it('should clear the interval when stopped', () => {
    const callback = jest.fn();
    
    startTimer(20, callback);
    stopTimer();

    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
  
  it('should only allow one timer to run at a time', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    startTimer(20, callback1);
    startTimer(30, callback2);
    
    expect(clearInterval).toHaveBeenCalledTimes(1); // Should have cleared the first one before starting the second
    expect(setInterval).toHaveBeenCalledTimes(2);
    
    stopTimer();
  });
});
