import Stripe from 'stripe';

// ---- CORE IMPORTS ---- //
import {COUNTRY_NAMES} from '@/constants/country';
import {NormalizedBankDetails} from '@/ui/components/payment/types';

export type BankTransferType = 'eu_bank_transfer' | 'us_bank_transfer';

export type BankTransferCurrency = 'eur' | 'usd';

export type CountryCode = 'FR' | 'DE' | 'ES' | 'IT' | 'NL' | 'BE' | 'US';

type StripeBankTransfer =
  | {
      type: 'eu_bank_transfer';
      eu_bank_transfer: {
        country: CountryCode;
      };
    }
  | {
      type: 'us_bank_transfer';
    };

const BANK_TRANSFER_CONFIGS: Record<
  BankTransferCurrency,
  {
    type: BankTransferType;
    recommendedCountries: CountryCode[];
    default: CountryCode;
  }
> = {
  eur: {
    type: 'eu_bank_transfer',
    recommendedCountries: ['FR', 'DE', 'ES', 'IT', 'NL', 'BE'],
    default: 'FR',
  },
  usd: {
    type: 'us_bank_transfer',
    recommendedCountries: ['US'],
    default: 'US',
  },
};

const COUNTRY_TO_BANK_TRANSFER: Record<
  CountryCode,
  {currency: BankTransferCurrency; type: BankTransferType}
> = Object.entries(BANK_TRANSFER_CONFIGS).reduce(
  (acc, [currency, config]) => {
    config.recommendedCountries.forEach(country => {
      acc[country] = {
        currency: currency as BankTransferCurrency,
        type: config.type,
      };
    });
    return acc;
  },
  {} as Record<
    CountryCode,
    {currency: BankTransferCurrency; type: BankTransferType}
  >,
);

export function getBankTransferConfig(
  currency: string,
  countryCode?: CountryCode,
): StripeBankTransfer {
  const normalizedCurrency = currency.toLowerCase() as BankTransferCurrency;
  const currencyConfig = BANK_TRANSFER_CONFIGS[normalizedCurrency];

  if (!currencyConfig) {
    throw new Error(
      `Stripe bank transfers via customer balance do not support currency "${currency.toUpperCase()}"`,
    );
  }

  // USD → no country, ever
  if (normalizedCurrency === 'usd') {
    return {
      type: 'us_bank_transfer',
    };
  }

  // EUR → validate country
  if (countryCode) {
    const countryConfig = COUNTRY_TO_BANK_TRANSFER[countryCode];

    if (!countryConfig) {
      throw new Error(
        `Bank transfer is not supported for country: ${countryCode}`,
      );
    }

    if (countryConfig.currency !== normalizedCurrency) {
      throw new Error(
        `Country "${countryCode}" does not support ${currency.toUpperCase()} bank transfers`,
      );
    }

    return {
      type: 'eu_bank_transfer',
      eu_bank_transfer: {
        country: countryCode,
      },
    };
  }

  // EUR fallback → default country for currency
  return {
    type: 'eu_bank_transfer',
    eu_bank_transfer: {
      country: currencyConfig.default,
    },
  };
}

export function getBankDetailsFromInstructions(
  instructions?: Stripe.PaymentIntent.NextAction.DisplayBankTransferInstructions,
): NormalizedBankDetails | null {
  const financialAddress = instructions?.financial_addresses?.[0];
  if (!financialAddress) return null;

  switch (financialAddress.type) {
    case 'iban': {
      const iban = financialAddress.iban;
      if (!iban) return null;
      return {
        type: 'iban',
        iban: iban.iban,
        swiftCode: iban.bic,
        accountHolderName: iban.account_holder_name,
        country: getCountryName(iban.country),
        bankName: iban.bank_name ?? undefined,
        bankAddress: iban.bank_address ?? undefined,
        accountHolderAddress: iban.account_holder_address ?? undefined,
      };
    }

    case 'aba': {
      const aba = financialAddress.aba;
      if (!aba) return null;
      return {
        type: 'aba',
        routingNumber: aba.routing_number,
        accountNumber: aba.account_number,
        bankName: aba.bank_name ?? undefined,
        accountType: aba.account_type ?? undefined,
      };
    }

    default:
      return null;
  }
}

export function getCountryName(code: string) {
  return COUNTRY_NAMES[code.toUpperCase()] || code;
}
