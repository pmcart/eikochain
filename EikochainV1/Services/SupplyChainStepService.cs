using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class SupplyChainStepService: ISupplyChainStepService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public SupplyChainStepService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }

        public async Task<SupplyChainStep> CreateSCStep(Guid scId, Guid orgId, SupplyChainStep newStep)
        {
            SupplyChainStep step = new SupplyChainStep()
            {
                Id = Guid.NewGuid(),
                OrgId = newStep.OrgId,
                SupplyChainId = newStep.SupplyChainId,
                StepId = newStep.StepId,
                StepTitle = newStep.StepTitle,
            };

            _context.SupplyChainStep.Add(step);
            _context.SaveChanges();

            return step;
        }

        public async Task<bool> UpdateSCStep(Guid scId, Guid orgId, string stepId, SupplyChainStep editStep)
        {

            var step = await _context.SupplyChainStep.Where(x => x.OrgId == orgId && x.SupplyChainId == scId && x.StepId == stepId)
                .FirstOrDefaultAsync();

            // Validate entity is not null
            if (step != null)
            {
                step.StepTitle = editStep.StepTitle;
                _context.SaveChanges();
                return true;
            }
            else 
                return false;
        }

        public async Task<bool> DeleteSCStep(Guid scId, Guid orgId, string stepId)
        {

            try
            {
                var step = await _context.SupplyChainStep
                    .Where(x => x.OrgId == orgId && x.SupplyChainId == scId && x.StepId == stepId)
                    .FirstOrDefaultAsync();

                _context.SupplyChainStep.Remove(step);
                _context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteAllSCStep(Guid scId, Guid orgId)
        {

            try
            {
                var steps = await _context.SupplyChainStep
                    .Where(x => x.OrgId == orgId && x.SupplyChainId == scId)
                    .ToListAsync();

                _context.SupplyChainStep.RemoveRange(steps);
                _context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<SupplyChainStep> GetSCStep(Guid scId, Guid orgId, string stepId)
        {
            try
            {
                if (orgId == Guid.Empty)
                {
                    var sc = await _context.SupplyChainStep.Where(x => x.SupplyChainId == scId && x.StepId == stepId)
                        .FirstAsync();
                    return sc;
                }
                else
                {
                    var sc = await _context.SupplyChainStep.Where(x => x.SupplyChainId == scId && x.OrgId == orgId && x.StepId == stepId)
                        .FirstAsync();
                    return sc;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UpdateSCStepClicks(SupplyChainStep step)
        {
            try
            {
                var currStep = await _context.SupplyChainStep.Where(x => x.SupplyChainId == step.SupplyChainId && x.StepId == step.StepId)
                    .FirstOrDefaultAsync();

                currStep.QrClicks = step.QrClicks;
                currStep.WebsiteClicks = step.WebsiteClicks;

                _context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IEnumerable<SupplyChainStep>> GetAllSCSteps(Guid scId, Guid orgId)
        {
            try
            {
                if (orgId == Guid.Empty)
                {
                    var steps = await _context.SupplyChainStep.Where(x => x.SupplyChainId == scId)
                        .ToListAsync();

                    return steps;
                }
                else
                {
                    var steps = await _context.SupplyChainStep.Where(x => x.SupplyChainId == scId && x.OrgId == orgId)
                        .ToListAsync();

                    return steps;
                }

            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
