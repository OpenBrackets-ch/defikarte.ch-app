﻿using DefikarteBackend.Model;
using FluentValidation;
using System.Text.RegularExpressions;

namespace DefikarteBackend.Validation
{
    public class DefibrillatorRequestValidator : AbstractValidator<DefibrillatorRequest>
    {
        public DefibrillatorRequestValidator()
        {
            RuleFor(x => x.Latitude).NotEmpty();
            RuleFor(x => x.Longitude).NotEmpty();
            RuleFor(x => x.Reporter).NotEmpty();
            RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Description).MaximumLength(200);
            RuleFor(x => x.OperatorPhone).Custom((value, context) => PhoneNumberValid(value, context)).When(x => !string.IsNullOrEmpty(x.OperatorPhone));
            RuleFor(x => x.Access).NotNull();
            RuleFor(x => x.Indoor).NotNull();
            RuleFor(x => x.EmergencyPhone).NotEmpty().Custom((value, context) => PhoneNumberValid(value, context));
            // opening hours validation is missing
        }

        private static void PhoneNumberValid(string phoneNumberRaw, ValidationContext<DefibrillatorRequest> context)
        {
            if (string.IsNullOrEmpty(phoneNumberRaw))
            {
                return;
            }

            var result = Regex.Match(phoneNumberRaw, "112|144|117|118|1414");
            if (result.Success)
            {
                return;
            }

            var phoneNumberUtil = PhoneNumbers.PhoneNumberUtil.GetInstance();
            try
            {
                var value = phoneNumberUtil.Parse(phoneNumberRaw, "CH");
                var valid =
                  phoneNumberUtil.IsPossibleNumber(value) &&
                  phoneNumberUtil.IsValidNumber(value) &&
                 (phoneNumberUtil.IsValidNumberForRegion(value, "CH")
                 || phoneNumberUtil.IsValidNumberForRegion(value, "LI"));

                if (!valid)
                {
                    context.AddFailure(context.PropertyPath, "Phonenumber not valid");
                }
            }
            catch (System.Exception)
            {
                context.AddFailure(context.PropertyPath, "Phonenumber not valid");
            }
        }
    }
}