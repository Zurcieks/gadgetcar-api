import { Test, TestingModule } from '@nestjs/testing'; 
import { TasksService } from './tasks.service';  
import { getModelToken } from '@nestjs/mongoose';  
import { Model } from 'mongoose';  
import { User } from '../schemas/User.schema';  
//Mockowanie to tworzenie sztucznych obiektów które naśladują baze danych
describe('TasksService', () => {
  let service: TasksService; // Zmienna dla testowanej usługi
  let userModel: Model<User>; // Zmienna dla modelu użytkownika (mockowana wersja)

  beforeEach(async () => {
    // Tworzymy mock modelu użytkownika z funkcją deleteMany
    const mockUserModel = {
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 5 }), // Symulujemy, że usunięto 5 użytkowników
    };

    // Tworzymy moduł testowy z mockowanym modelem użytkownika
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService, // Dodajemy oryginalną usługę do testowania
        {
          provide: getModelToken(User.name), // Zamieniamy model Mongoose na jego mock
          useValue: mockUserModel, // Przekazujemy mockowany model użytkownika
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService); // Pobieramy instancję testowanej usługi
    userModel = module.get<Model<User>>(getModelToken(User.name)); // Pobieramy mockowany model użytkownika
  });

  it('should be defined', () => {
    // Sprawdzamy, czy usługa została poprawnie zainicjalizowana
    expect(service).toBeDefined();
  });

  it('should call deleteMany with correct filter and log the count', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(); // Podstawiamy mock dla console.log

    await service.deleteUnVerifiedAccount(); // Wywołujemy funkcję usuwającą niezweryfikowane konta

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - 1); // Tworzymy datę z wczoraj

    // Sprawdzamy, czy deleteMany został wywołany z poprawnym filtrem
    expect(userModel.deleteMany).toHaveBeenCalledWith({
      isEmailVerified: false, // Warunek: email niezweryfikowany
      createdAt: { $lt: expectedDate }, // Warunek: konto starsze niż 24h
    });

    // Sprawdzamy, czy console.log wypisał poprawną informację
    expect(consoleSpy).toHaveBeenCalledWith('Usunięto 5 niepotwierdzonych kont.');

    consoleSpy.mockRestore(); // Przywracamy oryginalne zachowanie console.log
  });
});
