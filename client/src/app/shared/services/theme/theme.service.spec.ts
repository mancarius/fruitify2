import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        ThemeService
      ],
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme', () => {
    // Arrange
    const isDarkTheme = service.isDarkActive();
    // Act
    service.toggleTheme();
    TestBed.flushEffects();
    // Assert
    expect(service.isDarkActive()).toBe(!isDarkTheme);
  });

  it('should add dark class', () => {
    // Arrange
    spyOn<any>(service, '_addClass').and.callThrough();
    service['_theme'].set('light');
    // Act
    service.toggleTheme();
    TestBed.flushEffects();
    // Assert
    expect(service['_addClass']).toHaveBeenCalledWith('dark');
  });

  it('should remove dark class', () => {
    // Arrange
    spyOn<any>(service, '_removeClass').and.callThrough();
    service['_theme'].set('dark');
    // Act
    service.toggleTheme();
    TestBed.flushEffects();
    // Assert
    expect(service['_removeClass']).toHaveBeenCalledWith('dark');
  });

  it('should store theme in local storage', () => {
    // Arrange
    spyOn<any>(service, '_toStorage').and.stub();
    service['_theme'].set('light');
    // Act
    service.toggleTheme();
    TestBed.flushEffects();
    // Assert
    expect(service['_toStorage']).toHaveBeenCalledWith('dark');
  });

  it('should get theme from local storage on service initialization', () => {
    // Arrange
    const fromStorage = spyOn<any>(service, '_fromStorage').and.returnValue('dark');
    // Act
    service['_initializeTheme']();
    // Assert
    expect(fromStorage).toHaveBeenCalledTimes(1);
    expect(service['_theme']()).toBe('dark');
  });
});
