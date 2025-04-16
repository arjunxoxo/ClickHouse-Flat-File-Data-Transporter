
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckIcon, LoaderIcon } from "lucide-react";

interface ClickHouseConfigProps {
  config: {
    host: string;
    port: string;
    database: string;
    user: string;
    jwtToken: string;
  };
  setConfig: (config: any) => void;
  onConnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string | null;
}

const ClickHouseConfig: React.FC<ClickHouseConfigProps> = ({ 
  config, 
  setConfig, 
  onConnect, 
  isConnecting,
  isConnected,
  connectionError 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">ClickHouse Configuration</CardTitle>
        <CardDescription>Enter your ClickHouse connection details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              name="host"
              placeholder="localhost or cloud.clickhouse.com"
              value={config.host}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              placeholder="9440/8443 (https) or 9000/8123 (http)"
              value={config.port}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="database">Database</Label>
          <Input
            id="database"
            name="database"
            placeholder="default"
            value={config.database}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="user">User</Label>
          <Input
            id="user"
            name="user"
            placeholder="default"
            value={config.user}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jwtToken">JWT Token</Label>
          <Input
            id="jwtToken"
            name="jwtToken"
            type="password"
            placeholder="Your JWT token"
            value={config.jwtToken}
            onChange={handleChange}
          />
        </div>
        
        {connectionError && (
          <div className="text-sm text-destructive mt-2">{connectionError}</div>
        )}
        
        <Button 
          onClick={onConnect} 
          disabled={isConnecting || isConnected}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : isConnected ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : (
            'Connect'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClickHouseConfig;
