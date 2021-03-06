using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IAuthRepository
    {
        Task<User> Rigister(User user, string password);
        Task<User> Login(string username, string password);

        Task<bool> UserExists(string username);
    }
}