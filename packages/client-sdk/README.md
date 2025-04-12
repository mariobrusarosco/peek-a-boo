# @peek-a-boo/client-sdk

JavaScript client SDK for the Peek-a-boo feature flag service.

## Installation

```bash
npm install @peek-a-boo/client-sdk
# or
yarn add @peek-a-boo/client-sdk
# or
pnpm add @peek-a-boo/client-sdk
```

## Usage

### Basic Usage

```javascript
import { FeatureFlagClient } from '@peek-a-boo/client-sdk';

// Initialize the client
const client = new FeatureFlagClient({
  apiKey: 'your-api-key',
  environmentKey: 'development', // or 'staging', 'production', etc.
});

// Check if a feature flag is enabled
const isEnabled = client.isEnabled('new-feature');
if (isEnabled) {
  // Show the new feature
} else {
  // Show the old feature
}

// Get a feature flag value
const color = client.getValue('button-color', { defaultValue: 'blue' });
document.getElementById('button').style.backgroundColor = color;
```

### Advanced Usage

#### User Targeting

```javascript
// Initialize with default context
const client = new FeatureFlagClient({
  apiKey: 'your-api-key',
  environmentKey: 'production',
  defaultContext: {
    userId: 'user-123',
    country: 'US',
  },
});

// Or provide context when checking flags
const isEnabled = client.isEnabled('premium-feature', {
  context: { 
    userId: 'user-123',
    plan: 'premium',
  },
});
```

#### Flag Change Listeners

```javascript
// Subscribe to flag changes
const unsubscribe = client.onFlagsChanged((flags) => {
  console.log('Flags changed:', flags);
  // Re-render UI or update application state
});

// Unsubscribe when no longer needed
unsubscribe();
```

#### Customizing the Client

```javascript
const client = new FeatureFlagClient({
  apiKey: 'your-api-key',
  environmentKey: 'production',
  baseUrl: 'https://your-custom-domain.com',
  pollingInterval: 60000, // 1 minute (default is 30 seconds)
  enableLogs: true,
  defaultFlagValues: {
    'feature-a': true,
    'theme-color': 'dark',
  },
});
```

#### Bootstrapping Flags

For faster startup, you can bootstrap the client with initial flag values:

```javascript
const client = new FeatureFlagClient({
  apiKey: 'your-api-key',
  environmentKey: 'production',
  bootstrap: {
    'feature-a': true,
    'feature-b': false,
    'theme-color': 'blue',
  },
});
```

#### Cleanup

```javascript
// Clean up resources when done
client.close();
```

## API Reference

### Constructor

```typescript
new FeatureFlagClient(options: ClientOptions)
```

#### ClientOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string | (required) | Your API key for accessing the Peek-a-boo service |
| environmentKey | string | (required) | The environment key (e.g., development, staging, production) |
| baseUrl | string | 'https://api.peek-a-boo.io' | Base URL for the API |
| pollingInterval | number | 30000 | How frequently to poll for updates (in milliseconds) |
| bootstrap | object | undefined | Initial flag values to bootstrap the SDK |
| enableLogs | boolean | false | Enable detailed logging |
| defaultFlagValues | object | {} | Default values to use when a flag is not found |
| defaultContext | object | undefined | Default context to use for all flag evaluations |

### Methods

#### isEnabled

```typescript
isEnabled(key: string, options?: FlagOptions): boolean
```

Checks if a feature flag is enabled.

#### getValue

```typescript
getValue<T>(key: string, options?: FlagOptions): T
```

Gets the value of a feature flag.

#### onFlagsChanged

```typescript
onFlagsChanged(callback: (flags: Record<string, any>) => void): () => void
```

Subscribe to flag changes. Returns an unsubscribe function.

#### initialize

```typescript
initialize(): Promise<void>
```

Initializes the client and fetches flags (called automatically by the constructor).

#### fetchFlags

```typescript
fetchFlags(): Promise<void>
```

Manually fetch the latest flags from the server.

#### close

```typescript
close(): void
```

Closes the client and cleans up resources.

## Types

```typescript
interface FlagOptions {
  context?: FlagContext;
  defaultValue?: any;
}

interface FlagContext {
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  language?: string;
  [key: string]: any;
}
``` 