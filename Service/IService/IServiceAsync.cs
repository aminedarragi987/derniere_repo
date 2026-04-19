using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Service.IService
{
    public interface IServiceAsync<TEntity, TDto>
    {
        
        Task Add(TDto tDto);
        Task Add(IEnumerable<TDto> tDto);
        

        Task Delete(object id);
        Task Delete(IEnumerable<TDto> entities);

        Task Update(TDto entityTDto);
        Task UpdateDetachedAsync(TDto entityTDto);
        Task UpdatePartialAsync(TDto entityTDto, 
                                params Expression<Func<TEntity,object>>[] updatedProperties);
        Task Update(IEnumerable<TDto> entities);

        Task<TDto> GetById(params object[] keyValues);

        
        Task<TDto> GetFirstOrDefault(Expression<Func<TEntity, bool>> predicate = null,
                                  Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                  Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                  bool disableTracking = true);

        IQueryable<TDto> GetAll();

        
        Task<IEnumerable<TDto>> GetMuliple(Expression<Func<TEntity, bool>> predicate = null,
                                  Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                  Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                  bool disableTracking = true);

        
        IQueryable<TDto> FromSql(string sql, params object[] parameters);

        
        Task<int> Count(Expression<Func<TDto, bool>> predicate = null);
        Task<bool> Exists(Expression<Func<TDto, bool>> predicate);
        Task Save();


    }
}