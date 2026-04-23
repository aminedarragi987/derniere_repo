using BCrypt.Net;

string password = "admin123";
string hash = BCrypt.Net.BCrypt.HashPassword(password);
bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);

Console.WriteLine($"Hash: {hash}");
Console.WriteLine($"Verify: {isValid}");
