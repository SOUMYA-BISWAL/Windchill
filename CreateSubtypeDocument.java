package ext.document;

import wt.doc.DocumentType;
import wt.doc.WTDocument;
import wt.fc.Persistable;
import wt.fc.PersistenceHelper;
import wt.inf.container.WTContainerHelper;
import wt.inf.container.WTContainerRef;
import wt.method.RemoteAccess;
import wt.method.RemoteMethodServer;
import wt.type.TypeDefinitionReference;
import wt.type.TypedUtilityServiceHelper;

import java.io.IOException;
import java.rmi.RemoteException;
import com.ptc.core.foundation.type.server.impl.TypeHelper;
import com.ptc.core.meta.common.TypeIdentifier;
import com.ptc.core.meta.common.impl.WCTypeIdentifier;
import wt.util.WTException;
import wt.util.WTProperties;
import wt.util.WTPropertyVetoException;

public class SubtypeDocument implements RemoteAccess {

	public static void main(String[] args) throws WTPropertyVetoException, WTException, IOException  {
		//Variable Declaration.......
		String docName="TestDocument123";
		String docNumber= "wtpr123";
		String wtProperties=null;
		String container_path = "/wt.inf.container.OrgContainer=Demo Organization/wt.pdmlink.PDMLinkProduct=GOLF_CART";
		
		
		WTProperties properties = WTProperties.getLocalProperties();
        wtProperties = properties.getProperty("wt.webservices.doctype", "D:\\ptc\\Windchill_11.0\\Windchill\\codebase");
        System.out.println("Wt Properties:->  "+wtProperties);
        
		TypeIdentifier customType =TypeHelper.getTypeIdentifier(wtProperties);
		System.out.println("Successfull Find Type:-> "+customType);
		
		TypeDefinitionReference customTDR = TypedUtilityServiceHelper.service.getTypeDefinitionReference(customType.getTypename());
		System.out.println("find the TypeDefinitionReference");
		
		WTDocument doc = WTDocument.newWTDocument();
		WTContainerRef containerRef = WTContainerHelper.service.getByPath(container_path);
		doc.setName(docName);
		doc.setNumber(docNumber);
		doc.setContainerReference(containerRef);
		doc.setTypeDefinitionReference(customTDR);
		doc = (WTDocument) PersistenceHelper.manager.store((Persistable)doc);
		System.out.println("Document Created Successful"+doc);
	}

}
