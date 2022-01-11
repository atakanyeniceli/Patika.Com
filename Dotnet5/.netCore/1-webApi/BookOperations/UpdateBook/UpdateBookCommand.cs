using System;
using System.Linq;
using _1_webApi.DBOperations;

namespace _1_webApi.BooksOperations.UpdateBook{
    public class UpdateBookCommand{
        private readonly BookStoreDbContext _dbContext;
        public int BookId { get; set; }
        public UpdateBookModel Model { get; set; }
        public UpdateBookCommand(BookStoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Handle(){
            var book=_dbContext.Books.SingleOrDefault(x => x.Id == BookId);
            if(book is null)throw new InvalidOperationException("GÜncellenecek Kitap Bulunamadı!");

            book.GenreId = Model.GenreId != default ? Model.GenreId : book.GenreId;
            book.Title = Model.Title ?? book.Title;
            _dbContext.SaveChanges();
        }
    }
    public class UpdateBookModel{
        public string Title { get; set; }
        public int GenreId { get; set; }
    }
}